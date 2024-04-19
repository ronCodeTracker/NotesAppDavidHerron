



//  Name: Ronald Kiefer
//  Date: Arpil 19, 2024 Friday 1:00 PM
//  Hebrew:        ר ו נ  א ל ד



//  Accessing the user service with SuperAgent
//  Acccessing the user-authentication service with SuperAgent






// missing hashpass function?
// not ready for hashpass



import { default as request } from 'superagent';
import util from 'util';
import url from 'url';
const URL = url.URL;


import DBG from 'debug';
const debug = DBG('notes:users-superagent');
const error = DBG('notes:error-superagent');

var authid = 'them';
var authcode = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';


// SuperAgent - we don't leave conncetion open to service.  Instead, we open a new connection on each request.
// page 348 


function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL); // from environment variable
    requrl.pathname = path; // path is the add on to the base URL to get to right web page I would say
    return requrl.toString();
}  // gets the url for the request


// take data provided
// construct anonymous object
// POST to the server

export async function create(username, password,
    provider, familyName, givenName, middleName,
    emails, photos) {
    var res = await request
        .post(reqURL('/create-user')) // open new server connection with each request
        .send({
            username, password, provider,
            familyName, givenName, middleName, emails, photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode); // no .then or .end so default is promise
    return res.body;
}

export async function update(username, password,
    provider, familyName, givenName, middleName,
    emails, photos) {
    var res = await request
        .post(reqURL(`/update-user/${username}`)) // open new server connection with each request
        .send({
            username, password, provider,
            familyName, givenName, middleName, emails, photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}




export async function find(username) {
    var res = await request
        .get(reqURL(`/find/${username}`)) // open new server connection with each request
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}





export async function userPasswordCheck(username, password) {
    var res = await request
        .post(reqURL(`/password-check`)) // open new server connection with each request
        .send({ username, password })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}




// profile comes from the passport
export async function findOrCreate(profile) {
    var res = await request
        .post(reqURL('/find-or-create')) // open new server connection with each request
        .send({
            username: profile.id,
            password: profile.password,
            provider: profile.provider,
            familyName: profile.familyName,
            givenName: profile.givenName,
            middleName: profile.middleName,
            emails: profile.emails, photos: profile.photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}




export async function listUsers() {
    var res = await request
        .get(reqURL('/list')) // open new server connection with each request
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}



