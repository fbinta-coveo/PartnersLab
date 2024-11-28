import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeCaseAssitsEngine } from "../../common/Engine";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SubTitle from "./SubTitle";
import TextField from "@mui/material/TextField";
import ProvideDetails from "./ProvideDetails";
import Button from "@mui/material/Button";
import RecommendListSelect from "./RecommendListSelect";
import CircularProgress from "@mui/material/CircularProgress";
import FormInputWrapper from "./FormInputWrapper";
import {
  buildCaseField,
  loadCaseInputActions,
  loadCaseFieldActions,
  loadCaseAssistAnalyticsActions,
  CaseFieldState,
  CaseFieldSuggestion,
  CaseAssistEngine,
  SetCaseInputActionCreatorPayload,
  buildDocumentSuggestionList,
  DocumentSuggestionList,
  DocumentSuggestionListState
} from "@coveo/headless/case-assist";
import {
  CaseAssistContext,
  CaseAssistContextType,
} from "../../common/CaseAssistContext";

import {
  CaseClassifyFields,
  DescriptionTitle,
  ProvideDetailsDescription,
  SubjectTitle,
  CaseFormMainTitle,
  DocumentSuggestTitle,
} from "../../config/CaseAssistConfig";
import MainTitle from "./MainTitle";
import { CustomContextContext } from "../CustomContext/CustomContextContext";
import { KEY_NAME_PROFILE_SELECTED } from "../../config/ProfileConfig";
import styled from "styled-components";

const Initial_STATE: CaseFieldState = {
  suggestions: [],
  loading: false,
  error: null,
  value: "",
};

const Initial_STATE_CASE_SELECTED: CaseFieldSuggestion = {
  id: "",
  value: "",
  confidence: 0,
};

const Profile_Selected_Name =
  localStorage.getItem(KEY_NAME_PROFILE_SELECTED) !== null
    ? localStorage
        .getItem(KEY_NAME_PROFILE_SELECTED)
        ?.replace(/['"]+/g, "")
        .split(" ")[0]
        .toString()
    : "";

const CaseForm: React.FunctionComponent = () => {
  let navigate = useNavigate();
  const [caseClassifyFieldsState, setCaseClassifyFieldsState] = useState<
    CaseFieldSuggestion[]
  >(() => CaseClassifyFields.map((x) => Initial_STATE_CASE_SELECTED));
  const [caseClassifyFields, setCaseClassifyFields] = useState<
    CaseFieldState[]
  >(() => CaseClassifyFields.map((x) => Initial_STATE));

  const [caseEngine, setCaseEngine] = useState<CaseAssistEngine | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rerender, setReRender] = useState(false);
  const [documentSuggestController, setDocumentSuggestController] =
    useState<DocumentSuggestionList | null>(null);
  const [documentSuggestState, setDocumentSuggestState] = useState<DocumentSuggestionListState>({loading : false, error : null, documents : []});
  const [showDocSuggest, setShowDocSuggest] = useState(false);

  const updateCaseFormInputAndFetch = async (
    engine: CaseAssistEngine,
    options: SetCaseInputActionCreatorPayload
  ) => {
    const action = await loadCaseInputActions(engine).updateCaseInput(options);
    const fieldAction: any = await loadCaseFieldActions(
      engine
    ).fetchCaseClassifications();
    const AnalyticsAction = await loadCaseAssistAnalyticsActions(
      engine
    ).logUpdateCaseField(options.fieldName);

    /* window.coveoua("svc:setAction", "ticket_field_update", {
      fieldName: "category",
    });
    window.coveoua("svc:setTicket", {
      category: options.fieldName,
    });
    window.coveoua("send", "event", "svc", "click", {
      searchHub: "case_assist_interface",
    }); */

    await engine.dispatch(action);
    await engine.dispatch(fieldAction);
    documentSuggestController?.fetch();

    setReRender(!rerender);
    /* await engine.dispatch(AnalyticsAction); */
  };

  const initializeFieldsAndActions = async (engine: CaseAssistEngine) => {
    const caseClassifyfieldsController = CaseClassifyFields.map((item) => {
      return buildCaseField(engine, {
        options: {
          field: item.field,
        },
      });
    });

    caseClassifyfieldsController.forEach((item, index) => {
      item.subscribe(() => {
        setCaseClassifyFields((prev) => {
          prev[index] = item.state;
          return prev;
        });
      });
    });

    const DocSuggestController = buildDocumentSuggestionList(engine);
    setDocumentSuggestController(DocSuggestController);
    DocSuggestController.fetch();
    DocSuggestController.subscribe(() =>
      setDocumentSuggestState(DocSuggestController.state)
    );

    setCaseEngine(engine);

    updateCaseFormInputAndFetch(engine, {
      fieldName: "subject",
      fieldValue: "",
    });

    updateCaseFormInputAndFetch(engine, {
      fieldName: "description",
      fieldValue: "",
    });
  };

  const updateField = () => {
    if ((subject || description) && caseEngine) {
      updateCaseFormInputAndFetch(caseEngine, {
        fieldName: "subject",
        fieldValue: subject,
      });
      updateCaseFormInputAndFetch(caseEngine, {
        fieldName: "description",
        fieldValue: description,
      });
    }
  };

  const handleSelection = (item: CaseFieldSuggestion, index: number) => {
    const temp = [...caseClassifyFieldsState];
    temp[index] = item;
    setCaseClassifyFieldsState(temp);
    setReRender(!rerender);
  };

  useEffect(() => {
    initializeCaseAssitsEngine().then((engine) => {
      initializeFieldsAndActions(engine);
    });
  }, []);

  useEffect(() => {
    if (subject === "" && description === "" && caseEngine) {
      updateCaseFormInputAndFetch(caseEngine, {
        fieldName: "subject",
        fieldValue: "",
      });
      updateCaseFormInputAndFetch(caseEngine, {
        fieldName: "description",
        fieldValue: "",
      });
    }

    const unsubID = setTimeout(() => {
      if (subject || description) {
        updateField();
      }
    }, 500);

    return () => {
      clearTimeout(unsubID);
    };
  }, [subject, description]);

  const characterCountPercentage = () => {
    return (description.split(" ").length / 20) * 100;
  };

  return (
    <>
      {!showDocSuggest ? (
        <Container
          maxWidth="lg"
          sx={{ marginBottom: "50px", marginTop: "100px" }}
        >
          {Profile_Selected_Name === "Anonymous" ? (
            <MainTitle title={"Please Select a Profile"} />
          ) : (
            <Grid container justifyContent={"center"}>
              <MainTitle title={CaseFormMainTitle} />
              <Grid container justifyContent={"flex-start"}>
                <FormInputWrapper>
                  <SubTitle title={SubjectTitle} />
                  <TextField
                    fullWidth
                    id="fullWidth"
                    onChange={(ev) => setSubject(ev.target.value)}
                  />
                </FormInputWrapper>
                <FormInputWrapper>
                  <SubTitle title={DescriptionTitle} />
                  <TextField
                    fullWidth
                    id="fullWidth"
                    multiline
                    onChange={(ev) => setDescription(ev.target.value)}
                  />
                </FormInputWrapper>
                <Grid container justifyContent={"flex-end"}>
                  <ProvideDetails
                    description={ProvideDetailsDescription}
                    progress={characterCountPercentage()}
                  />
                </Grid>
                {caseClassifyFields.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <FormInputWrapper
                        customStyle={{
                          minHeight: "100px",
                        }}
                      >
                        <SubTitle title={CaseClassifyFields[index].title} />
                        {item.loading ? (
                          <CircularProgress color="secondary" />
                        ) : (
                          <RecommendListSelect
                            recommendation={item.suggestions}
                            handleSelection={(suggestion) =>
                              handleSelection(suggestion, index)
                            }
                            selected={caseClassifyFieldsState[index]}
                          />
                        )}
                      </FormInputWrapper>
                    </React.Fragment>
                  );
                })}
              </Grid>
              <Button
                variant="contained"
                style={{ width: "200px", marginTop: "100px" }}
                onClick={() => setShowDocSuggest(true)}
              >
                Next
              </Button>
            </Grid>
          )}
        </Container>
      ) : (
        <Container
          maxWidth="lg"
          sx={{ marginBottom: "50px", marginTop: "100px" }}
        >
          {Profile_Selected_Name === "Anonymous" ? (
            <MainTitle title={"Please Select a Profile"} />
          ) : (
            <Grid container justifyContent={"center"}>
              <MainTitle title={DocumentSuggestTitle} />
              <Grid container justifyContent={"flex-start"}>
                

                { documentSuggestState.documents?.map((item, index)=>{

                  return <DocumentSuggestContainer key ={index}>

                        <h5><a href={item.clickUri} target="_blank">{item.title}</a></h5>
                        <p>{item.excerpt}</p>
                        </DocumentSuggestContainer>
                })}
              </Grid>

              <Button
                variant="contained"
                style={{
                  width: "200px",
                  marginTop: "100px",
                  height: "50px",
                  marginInline: "20px",
                }}
                onClick={() => setShowDocSuggest(false)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                style={{
                  width: "200px",
                  marginTop: "100px",
                  height: "50px",
                  marginInline: "20px",
                }}
                onClick={() => navigate('/home')}
              >
                Open a ticket
              </Button>
            </Grid>
          )}
        </Container>
      )}
    </>
  );
};

export default CaseForm;




const DocumentSuggestContainer  = styled.div`
    border: 1px solid grey;
    width: 100%;
    padding : 15px 20px;
    border-radius: 6px;
    margin: 10px;
    box-sizing: border-box;

    & a{
      color : black
    }

    &:hover{
      border-color : black;
    }
`
