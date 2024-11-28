import {
  buildDocumentSuggestionList,
  loadCaseAssistAnalyticsActions,
  loadCaseFieldActions,
  loadCaseInputActions,
} from "@coveo/headless/case-assist";
import { useEffect, useState } from "react";
import { initializeCaseAssitsEngine } from "../../common/Engine";

const DocumentSuggestListRenderer = ({ controller }) => {


  const updateCaseFormInputAndFetch = async (engine, options) => {
    const action = loadCaseInputActions(engine).updateCaseInput(options);
    const fieldAction = loadCaseFieldActions(engine).fetchCaseClassifications();
    const AnalyticsAction = loadCaseAssistAnalyticsActions(
      engine
    ).logUpdateCaseField(options.fieldName);
    await engine.dispatch(action);
    await engine.dispatch(fieldAction);
    /* await engine.dispatch(AnalyticsAction); */
  };

  

  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), []);

  console.log(state);

  return <>hamza</>;
};

const DocumentSuggestList = () => {
  const [engine, setEngine] = useState(null);
  const [controller, setController] = useState(null);
  useEffect(() => {
    initializeCaseAssitsEngine().then((engine) => {
      setEngine(engine);
      setController(buildDocumentSuggestionList(engine));
    });
  }, []);

  controller?.fetch();

  return controller && <DocumentSuggestListRenderer controller={controller} />;
};

export default DocumentSuggestList;
