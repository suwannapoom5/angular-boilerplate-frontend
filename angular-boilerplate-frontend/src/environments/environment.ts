const WEB_BASE_URL = 'http://localhost:4200/'
const MASTERDATA_API_URL = 'http://localhost:4200/'
const AUTHEN_API_URL = 'http://localhost:4200/'
const WEBSOCKET_BASE_URL = 'http://localhost:4200/'

export const environment = {
    SECRET_KEY: '',

    MASTERDATA_API_URL: MASTERDATA_API_URL,
    AUTHEN_API_URL: AUTHEN_API_URL,

    PROTECTED_FILE_PATH: MASTERDATA_API_URL + '/File/GetFile',
    WEBSOCKET_CHAT: WEBSOCKET_BASE_URL,
    WEBSOCKET_NOTIFY: WEBSOCKET_BASE_URL,

    // thaID
    thaid_auth_url: 'https://imauthsbx.bora.dopa.go.th/api/v2/oauth2/auth/',
    thaid_token_url: 'https://imauthsbx.bora.dopa.go.th/api/v2/oauth2/token/',
    thaid_client_id: 'bDNWUDBJYVNJVE4xNDhPRUhsTDdZSXNRM0RLZzl6WE4', // need to change
    thaid_redirect_uri_register: WEB_BASE_URL + '/auth/register/person/thaid',
    thaid_redirect_uri_edit: WEB_BASE_URL + '/profile/edit-profile',
    thaid_redirect_uri_login: WEB_BASE_URL + '/sso-login/thaid',
};
