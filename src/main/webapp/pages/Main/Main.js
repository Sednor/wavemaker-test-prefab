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
        let once = false;

        $(`#${$scope.Variables.kendoTableId.getData().dataValue}`).kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: $scope.Variables.fetchUrl.getData().dataValue,
                    },
                    create: {
                        url: $scope.Variables.updateUrl.getData().dataValue,
                        type: "post"
                    },
                    update: {
                        url: $scope.Variables.updateUrl.getData().dataValue,
                        type: "update"
                    },
                    destroy: {
                        url: $scope.Variables.updateUrl.getData().dataValue,
                        type: "delete"
                    },
                    parameterMap: function(data, type) {
                        console.log(data);
                        if (data.hasOwnProperty("pageSize")) {
                            const DATA = Object.assign({}, data, {
                                size: data.pageSize
                            });

                            DATA.pageSize = undefined;
                            return DATA;
                        }
                    }
                },
                schema: {
                    data: "content"
                },
                serverPaging: true,
                pageSize: 2,
            },
            dataBound: function() {
                if (once) {
                    return;
                }
                const OPTIONS = this.getOptions();

                this.setOptions(Object.assign({}, OPTIONS, {
                    columns: [].concat(OPTIONS.columns, {
                        command: ["edit", "destroy"]
                    })
                }));
                once = true;
            },
            saveChanges: function() {
                console.log('asdasdsdas');
            },
            toolbar: ["create"],
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            editable: "popup"
        });
    }
}]);