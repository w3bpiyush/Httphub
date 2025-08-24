export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type KeyValue = {
    key: string;
    value: string;
};

export type BodyType = 'raw' | 'form-data';

export type RawFormat = 'json' | 'xml' | 'html' | 'text' | 'javascript';

export type AuthType = 'none' | 'basic' | 'bearer' | 'oauth2' | 'apikey';

export type AuthState = | {
    type: 'none';
} | {
    type: 'basic';
    username: string;
    password: string;
} | {
    type: 'bearer';
    token: string;
} | {
    type: 'oauth2';
    token: string
} | {
    type: 'apikey';
    key: string;
    value: string;
    location: 'header' | 'query'
};  

export type FormDataItem = {
    key: string;
    value: string;
    type: 'text' | 'file';
    file?: {
        uri: string;
        name: string;
        type: string;
    };
}

export interface RequestState {
    //name: string;
    method: HttpMethod;
    url: string;
    headers: KeyValue[];
    params: KeyValue[];
    bodyType: BodyType;
    rawFormat: RawFormat;
    rawBody: string;
    formData: FormDataItem[];
    auth: AuthState;
    tab: 'Headers' | 'Body' | 'Auth' | 'Params';
}
