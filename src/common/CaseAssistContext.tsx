import { CaseFieldSuggestion } from '@coveo/headless/case-assist';
import React,{useState} from 'react';
import { CaseClassifyFields } from '../config/CaseAssistConfig';

export type  CaseAssistContextType = {
    trackSelected : CaseFieldSuggestion | null,
    topicSelected: CaseFieldSuggestion | null,
    setTrackSelected : (state: CaseFieldSuggestion) => void
    setTopicSelected : (state: CaseFieldSuggestion) => void
    caseClassifyFieldsState : CaseFieldSuggestion[],
    setCaseClassifyFieldsState : (state: CaseFieldSuggestion[]) => void
}

export const CaseAssistContext = React.createContext<CaseAssistContextType>({
    trackSelected : null,
    topicSelected: null,
    setTrackSelected : ()=>{},
    setTopicSelected : ()=>{},
    caseClassifyFieldsState : [],
    setCaseClassifyFieldsState : ()=>{}
});

const Initial_STATE: CaseFieldSuggestion = {
    id: '',
    value: '',
    confidence: 0,
  };

const CaseAssistProvider: React.FC = ({children})=>{
    const [trackSelected, setTrackSelected] = useState<CaseFieldSuggestion | null>(null);
    const [topicSelected, setTopicSelected] = useState<CaseFieldSuggestion | null>(null);

    const [caseClassifyFieldsState, setCaseClassifyFieldsState] = useState<CaseFieldSuggestion[]>(() => CaseClassifyFields.map((x) => Initial_STATE))

    return <CaseAssistContext.Provider value = {{
        trackSelected, setTrackSelected, topicSelected, setTopicSelected,setCaseClassifyFieldsState,caseClassifyFieldsState
    }}>
        {children}
    </CaseAssistContext.Provider>
}

export default CaseAssistProvider;