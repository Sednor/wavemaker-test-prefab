Application.$controller("Kendo_data_tableController", ["$scope", function($scope) {
    "use strict";

    /*
     * This function will be invoked when any of this prefab's property is changed
     * @key: property name
     * @newVal: new value of the property
     * @oldVal: old value of the property
     */
    function propertyChangeHandler(key, newVal, oldVal) {

    }
    /* register the property change handler */
    $scope.propertyManager.add($scope.propertyManager.ACTIONS.CHANGE, propertyChangeHandler);

    $scope.onInitPrefab = function() {};

    $scope.onPageReady = function() {
        const COLUMNS = [];
        const FIELDS = {};
        const DATA_ID = $scope.Variables.dataId.getData().dataValue;
        const EDITABLE = $scope.Variables.editable.getData().dataValue;
        const REMOVABLE = $scope.Variables.removable.getData().dataValue;
        const CREATE = $scope.Variables.create.getData().dataValue;

        $scope.Variables.columns.getData().dataValue.forEach(column => {
            COLUMNS.push({
                field: column.name,
                title: column.title
            });
            FIELDS[column.name] = {
                type: column.type,
                editable: column.editable
            };
        });

        $(`#${$scope.Variables.kendoTableId.getData().dataValue}`).kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: $scope.Variables.fetchUrl.getData().dataValue,
                    },
                    create: {
                        url: $scope.Variables.updateUrl.getData().dataValue,
                        type: "post",
                        dataType: 'json',
                        contentType: "application/json"
                    },
                    update: {
                        url: options => `${$scope.Variables.updateUrl.getData().dataValue}/${options[DATA_ID]}`,
                        type: "put",
                        dataType: 'json',
                        contentType: "application/json"
                    },
                    destroy: {
                        url: options => `${$scope.Variables.updateUrl.getData().dataValue}/${options[DATA_ID]}`,
                        type: "delete"
                    },
                    parameterMap: function(data, type) {
                        if (data.hasOwnProperty("pageSize")) {
                            const DATA = Object.assign({}, data, {
                                size: data.pageSize
                            });

                            DATA.pageSize = undefined;
                            return DATA;
                        }
                        if (type !== 'read') {
                            return JSON.stringify(data);
                        }
                    }
                },
                schema: {
                    data: "content",
                    model: {
                        id: DATA_ID,
                        fields: FIELDS
                    }
                },
                serverPaging: true,
                pageSize: 2,
                onRequestEnd: function(e) {
                    if (e.type == "destroy") {
                        if (!e.response.Errors) {
                            e.sender.read();
                        }
                    }
                }
            },
            columns: [].concat(COLUMNS, [{
                command: [].concat(EDITABLE ? ["edit"] : [], REMOVABLE ? ["destroy"] : [])
            }]),
            toolbar: CREATE ? ["create"] : [],
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            editable: "popup"
        });
    }
}]);