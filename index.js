'use strict';

const Request = require('request');

//API documentation for Activiti can be found at http://activiti.org/userguide/index.html#_rest_api

module.exports = class ActivitiClient {

    //Here auth needs to be an object with properties user and pass
    constructor(baseUrl, auth) {
        this.baseUrl = baseUrl;
        this.auth = auth;
    }

    getProcessInstancesByDefinitionKey(processDefinitionKey, start, size, callback) {
        Request({
            url: this.baseUrl + "/runtime/process-instances?processDefinitionKey=" + processDefinitionKey + "&size=" + size + "&start=" + start + "&excludeSubprocesses=true",
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

    getProcessInstancesByBusinessKey(businessKey, start, size, callback) {
        Request({
            url: this.baseUrl + "/runtime/process-instances?businessKey=" + businessKey + "&size=" + size + "&start=" + start + "&excludeSubprocesses=true",
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

    getProcessStatus(processInstanceId, callback) {
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

    getProcessStatusByBusinessKey(businessKey, callback) {
        var that = this;

        this.getProcessInstancesByBusinessKey(businessKey, 0, 1, function(err, response) {
            if(err) {
                return callback(err);
            }
            that.getProcessStatus(response.data[0], callback);
        });
    }

    //Here variables is a list of objects with properties name, value and type, of which type is optional
    startProcessInstance(processDefinitionKey, businessKey, variables, callback) {
        var params = {
            processDefinitionKey: processDefinitionKey,
            businessKey: businessKey,
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

    getProcessTasks(businessKey, callback) {
        Request({
            url: this.baseUrl + "/runtime/tasks?assignee=" + this.auth.user + "&processInstanceBusinessKey=" + businessKey,
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

    getTaskVariables(taskId, callback) {
        Request({
            url: this.baseUrl + "/runtime/tasks/" + taskId + "/variables",
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
    completeTask(taskId, variables, callback) {
        var params = {
            action: "complete",
            variables: variables
        };

        Request({
            url: this.baseUrl + "/runtime/tasks/" + taskId,
            method: "POST",
            body: params,
            json: true,
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
};
