import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { RequestState, KeyValue, BodyType, RawFormat, AuthState, FormDataItem, HttpMethod } from '../types/RequestTypes';

const initialRequestState: RequestState = {
    name: '',
    method: 'GET',
    url: '',
    headers: [],
    params: [],
    bodyType: 'raw',
    rawFormat: 'json',
    rawBody: '',
    formData: [],
    auth: { type: 'none' },
    tab: 'Headers',
};

type Action =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_METHOD'; method: HttpMethod }
  | { type: 'SET_URL'; url: string }
  | { type: 'SET_HEADERS'; headers: KeyValue[] }
  | { type: 'SET_PARAMS'; params: KeyValue[] }
  | { type: 'SET_BODY_TYPE'; bodyType: BodyType }
  | { type: 'SET_RAW_FORMAT'; rawFormat: RawFormat }
  | { type: 'SET_RAW_BODY'; rawBody: string }
  | { type: 'SET_FORM_DATA'; formData: FormDataItem[] }
  | { type: 'SET_AUTH'; auth: AuthState }
  | { type: 'SET_TAB'; tab: RequestState['tab'] };

function requestReducer(state: RequestState, action: Action): RequestState {
  switch (action.type) {
    case 'SET_NAME': return {...state, name: action.name };
    case 'SET_METHOD': return {...state, method: action.method };
    case 'SET_URL': return {...state, url: action.url };
    case 'SET_HEADERS': return {...state, headers: action.headers };
    case 'SET_PARAMS': return {...state, params: action.params };
    case 'SET_BODY_TYPE': return {...state, bodyType: action.bodyType };
    case 'SET_RAW_FORMAT': return {...state, rawFormat: action.rawFormat };
    case 'SET_RAW_BODY': return {...state, rawBody: action.rawBody };
    case 'SET_FORM_DATA': return {...state, formData: action.formData };
    case 'SET_AUTH': return {...state, auth: action.auth };
    case 'SET_TAB': return {...state, tab: action.tab };
    default: return state;
  }
}

interface RequestContextProps {
  request: RequestState;
  dispatch: React.Dispatch<Action>;
}

const RequestContext = createContext<RequestContextProps | undefined>(undefined);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [request, dispatch] = useReducer(requestReducer, initialRequestState);

  return (
    <RequestContext.Provider value={{ request, dispatch }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};