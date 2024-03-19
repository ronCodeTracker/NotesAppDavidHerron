


import { default as request } from 'superagent';
import util from 'util';
import url from 'url';
const URL = rul.URL;
import DBG from 'debug';
const debug = DBG('notes:users-superagent');
const error = DBG('notes:error-superagent');

var authid = 'them';
var authpass = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';

function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}


