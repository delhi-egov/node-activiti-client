'use strict';

const Request = require('request');

//API documentation for Activiti can be found at http://activiti.org/userguide/index.html#_rest_api

module.exports = class ActivitiClient {

    //Here auth needs to be an object with properties user and pass
    constructor(baseUrl, auth) {
        this.baseUrl = baseUrl;
        this.auth = auth;
    }

    static getProcessInstances(processDefinitionKey, start, size, callback) {
        Request({
            url: this.baseUrl + "/runtime/process-instances?processDefinitionKey=" + processDefinitionKey + "&size=" + size + "&start=" + start,
            method: "GET",
            auth: this.auth
        }, function(err, httpResponse, body) {
            if(err) {
                return callback(err, null);
            }
            if (httpResponse.statusCode == 200) {
                return callback(null, body);
            }
            else {
                return callback(body, null);
            }
        });
    }

    static getProcessStatus(processInstanceId, callback) {
        Request({
            url: this.baseUrl + "/runtime/executions/" + processInstanceId + "/activities",
            method: "GET",
            auth: this.auth
        }, function(err, httpResponse, body) {
            if(err) {
                return callback(err, null);
            }
            if (httpResponse.statusCode == 200) {
                return callback(null, body);
            }
            else {
                return callback(body, null);
            }
        });
    }

    //Here variables is a list of objects with properties name, value, type of which type is optional
    static startProcessInstance(processDefinitionKey, variables, callback) {
        var params = {
            processDefinitionKey: processDefinitionKey,
            variables: variables
        };

        Request({
            url: this.baseUrl + "/runtime/process-instances",
            method: "POST",
            body: params,
            json: true,
            auth: this.auth
        }, function(err, httpResponse, body) {
            if(err) {
                return callback(err, null);
            }
            if (httpResponse.statusCode == 201) {
                return callback(null, body);
            }
            else {
                return callback(body, null);
            }
        });
    }
}
