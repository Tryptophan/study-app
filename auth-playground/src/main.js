"use strict";

let pw = 5;



const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');
const SSO_URL = "https://login.utexas.edu/login/UI/Login";
const SAMPLE_URL = "https://utdirect.utexas.edu/apps/registrar/course_schedule/20169"
const CANVAS_URL = "https://utexas.instructure.com/"
const CANVAS_TOKEN_URL = "https://utexas.instructure.com/profile/tokens"
const CANVAS_THING_2 = "https://utexas.instructure.com/api/v1/conversations/unread_count"

let r = request.defaults({jar: true});

let eid = ""; 


r(SSO_URL, function () {
    r.post({
        url: SSO_URL,
        form: {
            IDToken1: eid,
            IDToken2: pw
        }
    }, function(err, resp, body) {

        r.get({
        url: SAMPLE_URL
        },
        function(err, resp, body) {
            let page = cheerio.load(body);

            let AuthURL = page('form').prop('action');
            let AuthParamKey = page('input').prop('name');
            let AuthParamVal = page('input').prop('value');

            r.post({
                url: AuthURL,
            
                form: { AuthParamKey: AuthParamVal }
                },
            
                function(err, resp, body) {
                    r.get({
                        url: CANVAS_URL,
                    },
                    function(err, resp, body) {

                        let page = cheerio.load(body);

                        let url = page('form').prop('action');
                        let key = "SAMLResponse";//page('input[type=hidden]').prop('name');
                        let val = page('input[type=hidden]').prop('value');

                        // console.log(body);

                        r({
                            method: "POST",
                            url: url,
                            har: {
                                method: "POST",
                                headers: [
                                    {
                                        name: 'content-type',
                                        value: 'application/x-www-form-urlencoded',
                                    }
                                ],
                                postData: {
                                    mimeType: 'application/x-www-form-urlencoded',
                                    params: [
                                        {
                                            name: key,
                                            value: val,
                                        },
                                    ]
                                }
                            }
                        },
                        function(err, resp, body) { 

                            // console.log(resp.headers['set-cookie'])
                            // console.log(body);

                            r.get(CANVAS_URL, function(e, rj, b) {


                            r.get(CANVAS_THING_2, function(err, resp, body) {
                                let auth_token = resp.headers['set-cookie'].filter(
                                (c, i, a) => {
                                    return c.includes("_csrf_token");
                                })[0].split(";")[0].split("=")[1];

                                r({
                                method: "POST",
                                url: CANVAS_TOKEN_URL,
                                har: {
                                    method: "POST",
                                    headers: [
                                        {
                                          "name": "Accept",
                                          "value": "application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01"
                                        },
                                        {
                                            name: 'content-type',
                                            value: 'application/x-www-form-urlencoded',
                                        }
                                    ],
                                    postData: {
                                        mimeType: 'application/x-www-form-urlencoded',
                                        params: [
                                            {
                                                name: "authenticity_token",
                                                value: auth_token,
                                            },
                                            {
                                                name: "access_token%5Bpurpose%5D",
                                                value: "study-c3"
                                            },
                                            {
                                                name: "purpose",
                                                value: "study-c3"
                                            },
                                            {
                                                name: "expires_at",
                                                value: ""
                                            },
                                            {
                                                name: "access_token%5Bexpires_at%5D",
                                                value: ""
                                            },
                                        ]
                                    }
                                }
                            },
                            function(err, resp, body) { 
                                console.log(body);   
                            });
                            });
                            });

                            // _csrf_token -> authenticity_token
                            let auth_token = resp.headers['set-cookie'].filter(
                                (c, i, a) => {
                                    return c.includes("_csrf_token");
                                })[0].split(";")[0].split("=")[1];

                            r({
          "method": "POST",
          "url": "https://utexas.instructure.com/profile/tokens",
          "httpVersion": "HTTP/1.1",
          "headers": [
            {
              "name": "Cookie",
              "value": "log_session_id=6b5ebfb7949297be7e0f93bc23b2e584; canvas_session=BOfDK__NOot7CHawJ0Fx2Q+QoUBaxhzLlubpBs82bSaLfvul1BW1s5BpBsKqV9cZArmmVfvhjOowtbbaDuM0CCJLmQgrdxGBelBZ5UbRD0JWS5CzJIUP9PhIFFP49Vye03Ev3mw2twfmYuM9NHF5gdmfCh6SHH7C9GBeqV3OPrvPgocxlzuZQi1OPkykRnYUmPgljAovBPQ3zO7d5qb-LIr8GhuPrc1QTA-JewC6dtN-WdEzy2dqnGvtog8N9v0A2R4234_KErrgWZAUF4G9riz43ZpO0Csx6KPHpLcHAV7tbdXje2r_vJmDNszX17Zr2WnnWMRTMboWt0dl8WPXZie_-ZskZQsGHOU_Kc22XaBd3Nkt0M3jYZc073FDs3TNxUQNkZwaEKN9gLB_2Trr4CBDyqWLLj4uLu0crRChtdn-vyFHqC_iwL50FalmcGP7ZmZ_-s1QU5-BU6JDsY2czKk_i-MJk2t05_MYCWPN6Kjqb6pAcB-wDJkW_GYwymKMMGv_QT9ZRumoB1F0PODlU2eA-dfFgj2y4kpKpBZKvlor2tZ9K1Dp6yCwOj2udWYPUGYBbRyxcyPKL3j1uE98EgeBps8vuO22hquJaINsKBAVZc2kl_CDveSWOLB1NGSV3I.Thzyusr9xuOyH2YNPt9reZA46Sw.W8yFjQ; __utma=67209301.2062132556.1540130191.1540130191.1540130191.1; __utmc=67209301; __utmz=67209301.1540130191.1.1.utmcsr=login.utexas.edu|utmccn=(referral)|utmcmd=referral|utmcct=/login/UI/Login; __utmt=1; _csrf_token=nvP15ZJ%2BjhCaL9MYne%2FmORb3B8wYPlWq%2B1sSHEu85Rvmg5a3oBq2IfJau1%2Fvmp5IWJpegyEIOumuFV43J%2FS2Lg%3D%3D; __utmb=67209301.6.9.1540130327610"
            },
            {
              "name": "Origin",
              "value": "https://utexas.instructure.com"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate, br"
            },
            {
              "name": "X-CSRF-Token",
              "value": "nvP15ZJ+jhCaL9MYne/mORb3B8wYPlWq+1sSHEu85Rvmg5a3oBq2IfJau1/vmp5IWJpegyEIOumuFV43J/S2Lg=="
            },
            {
              "name": "Host",
              "value": "utexas.instructure.com"
            },
            {
              "name": "Accept-Language",
              "value": "en-US,en;q=0.9"
            },
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36"
            },
            {
              "name": "Content-Type",
              "value": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            {
              "name": "Accept",
              "value": "application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01"
            },
            {
              "name": "Referer",
              "value": "https://utexas.instructure.com/profile/settings"
            },
            {
              "name": "X-Requested-With",
              "value": "XMLHttpRequest"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Content-Length",
              "value": "234"
            },
            {
              "name": "DNT",
              "value": "1"
            }
          ],
          "queryString": [],
          "cookies": [
            {
              "name": "log_session_id",
              "value": "6b5ebfb7949297be7e0f93bc23b2e584",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "canvas_session",
              "value": "BOfDK__NOot7CHawJ0Fx2Q+QoUBaxhzLlubpBs82bSaLfvul1BW1s5BpBsKqV9cZArmmVfvhjOowtbbaDuM0CCJLmQgrdxGBelBZ5UbRD0JWS5CzJIUP9PhIFFP49Vye03Ev3mw2twfmYuM9NHF5gdmfCh6SHH7C9GBeqV3OPrvPgocxlzuZQi1OPkykRnYUmPgljAovBPQ3zO7d5qb-LIr8GhuPrc1QTA-JewC6dtN-WdEzy2dqnGvtog8N9v0A2R4234_KErrgWZAUF4G9riz43ZpO0Csx6KPHpLcHAV7tbdXje2r_vJmDNszX17Zr2WnnWMRTMboWt0dl8WPXZie_-ZskZQsGHOU_Kc22XaBd3Nkt0M3jYZc073FDs3TNxUQNkZwaEKN9gLB_2Trr4CBDyqWLLj4uLu0crRChtdn-vyFHqC_iwL50FalmcGP7ZmZ_-s1QU5-BU6JDsY2czKk_i-MJk2t05_MYCWPN6Kjqb6pAcB-wDJkW_GYwymKMMGv_QT9ZRumoB1F0PODlU2eA-dfFgj2y4kpKpBZKvlor2tZ9K1Dp6yCwOj2udWYPUGYBbRyxcyPKL3j1uE98EgeBps8vuO22hquJaINsKBAVZc2kl_CDveSWOLB1NGSV3I.Thzyusr9xuOyH2YNPt9reZA46Sw.W8yFjQ",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "__utma",
              "value": "67209301.2062132556.1540130191.1540130191.1540130191.1",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "__utmc",
              "value": "67209301",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "__utmz",
              "value": "67209301.1540130191.1.1.utmcsr=login.utexas.edu|utmccn=(referral)|utmcmd=referral|utmcct=/login/UI/Login",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "__utmt",
              "value": "1",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "_csrf_token",
              "value": "nvP15ZJ%2BjhCaL9MYne%2FmORb3B8wYPlWq%2B1sSHEu85Rvmg5a3oBq2IfJau1%2Fvmp5IWJpegyEIOumuFV43J%2FS2Lg%3D%3D",
              "expires": null,
              "httpOnly": false,
              "secure": false
            },
            {
              "name": "__utmb",
              "value": "67209301.6.9.1540130327610",
              "expires": null,
              "httpOnly": false,
              "secure": false
            }
          ],
          "headersSize": 1798,
          "bodySize": 0,
          "postData": {
            "mimeType": "application/x-www-form-urlencoded; charset=UTF-8",
            "text": "utf8=&authenticity_token=nvP15ZJ%2BjhCaL9MYne%2FmORb3B8wYPlWq%2B1sSHEu85Rvmg5a3oBq2IfJau1%2Fvmp5IWJpegyEIOumuFV43J%2FS2Lg%3D%3D&purpose=study-c2&access_token%5Bpurpose%5D=study-c2&expires_at=&access_token%5Bexpires_at%5D=&_method=post",
            "params": [
              {
                "name": "utf8",
                "value": ""
              },
              {
                "name": "authenticity_token",
                "value": "nvP15ZJ%2BjhCaL9MYne%2FmORb3B8wYPlWq%2B1sSHEu85Rvmg5a3oBq2IfJau1%2Fvmp5IWJpegyEIOumuFV43J%2FS2Lg%3D%3D"
              },
              {
                "name": "purpose",
                "value": "study-c2"
              },
              {
                "name": "access_token%5Bpurpose%5D",
                "value": "study-c2"
              },
              {
                "name": "expires_at",
                "value": ""
              },
              {
                "name": "access_token%5Bexpires_at%5D",
                "value": ""
              },
              {
                "name": "_method",
                "value": "post"
              }
            ]
          }}, function(err, resp, data) { 
            // console.log(data); 
        } 
                            )

                            // console.log(resp.headers['set-cookie'])
                            // console.log(auth_token)
                            // console.log()

                            r({
                                method: "POST",
                                url: CANVAS_TOKEN_URL,
                                har: {
                                    method: "POST",
                                    headers: [
                                        {
                                          "name": "Accept",
                                          "value": "application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01"
                                        },
                                        {
                                            name: 'content-type',
                                            value: 'application/x-www-form-urlencoded',
                                        }
                                    ],
                                    postData: {
                                        mimeType: 'application/x-www-form-urlencoded',
                                        params: [
                                            {
                                                name: "authenticity_token",
                                                value: auth_token,
                                            },
                                            {
                                                name: "access_token%5Bpurpose%5D",
                                                value: "study-c3"
                                            },
                                            {
                                                name: "purpose",
                                                value: "study-c3"
                                            },
                                            {
                                                name: "expires_at",
                                                value: ""
                                            },
                                            {
                                                name: "access_token%5Bexpires_at%5D",
                                                value: ""
                                            },
                                        ]
                                    }
                                }
                            },
                            function(err, resp, body) { 
                                // console.log(body);   
                            });
                        },
                        )

                    })
                }
            )

            // page('form[name="Login"]').prop('action');

            // console.log(page('form[name="Login"]').contents())
            // console.log(page('body').attr('name', 'Login').html());
            // console.log(page('form[name="Login"]').attr('input', 'name').prop('name'));
        },
    );
    });


});



// axios.post(SSO_URL, {
//     IDToken1: eid,
//     IDToken2: pw
//   })
//   .then(function (response) {

//     const page = cheerio.load(response);

//     console.log(page('body'));

//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// axios.post()
