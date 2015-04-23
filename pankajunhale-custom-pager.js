angular.module('custom-pager', ['ng']).run(['$templateCache', function ($templateCache) {
    var self = {};
    self.ngStyle = function () {
        
        var data = [];
        data[data.length] = "ng-style=myStyle={'background-color':pageBlock.ThemeStyle.BackgroundColor,'color':pageBlock.ThemeStyle.Color,'border':pageBlock.ThemeStyle.Border,'margin-left':pageBlock.ThemeStyle.MarginLeft,'border-radius':pageBlock.ThemeStyle.BorderRadius} ";
        return data.join("");
    };
    

    var html = [];
    html[html.length] = '<div ng-show="ShowPager" >';
    html[html.length] = '<div my-theme="options.Theme">';
    html[html.length] = '<div ng-repeat="pageBlock in Pagination" >';
    html[html.length] = '<ul class="pagination" ng-show="pageBlock.IsVisible" ' +
                        'ng-class={"pagination-lg":(options.Type=="lg"),"pagination-sm":(options.Type=="sm")} >';
    //first...
    html[html.length] = '<li ng-class="{disabled:(CurrentPageIndex==1)}">';
    html[html.length] = "<a href='javascript:void(0);' " + self.ngStyle(); 

    html[html.length] = " ng-click='firstPage()'>";
    html[html.length] = "<span aria-hidden='true'>First</span>";
    html[html.length] = "</a>";
    html[html.length] = '</li>';
    
    //previous...
    html[html.length] = '<li ng-class="{disabled:(CurrentPageIndex==1)}">';
    html[html.length] = "<a href='javascript:void(0);' ";
    html[html.length] = "<a href='javascript:void(0);' " + self.ngStyle();
    
    html[html.length] = "ng-click='previousPage((pageBlock.Index),pageBlock.StartPageNumber);'>";
    html[html.length] = "<span aria-hidden='true'>« Previous</span>";
    html[html.length] = "</a>";
    html[html.length] = '</li>';
    
    //pages...
    html[html.length] = '<li ng-repeat="page in pageBlock.Pages" ng-class="{active:(CurrentPageIndex == page)}">';

    html[html.length] = "<a href='javascript:void(0);' ng-show='CurrentPageIndex != page' " +self.ngStyle();
    html[html.length] = " ng-click='goToPage(page);'>";
    html[html.length] = '{{page}}';
    html[html.length] = "</a>";

    html[html.length] = '<a ng-show="CurrentPageIndex == page" ng-click="return;" ';
    html[html.length] = "ng-style=myStyle={'background-color':pageBlock.ThemeStyle.Color,";
    html[html.length] = "'color':pageBlock.ThemeStyle.BackgroundColor,border:pageBlock.ThemeStyle.Border,";
    html[html.length] = "'margin-left':pageBlock.ThemeStyle.MarginLeft,";
    html[html.length] = "'border-radius':pageBlock.ThemeStyle.BorderRadius}>";
    html[html.length] = '{{page}}';
    html[html.length] = "</a>";
    
    html[html.length] = '</li>';

    //next...
    html[html.length] = '<li ng-class="{disabled:(CurrentPageIndex==pages)}">';
    html[html.length] = "<a href='javascript:void(0);' ";
    html[html.length] = self.ngStyle();
    html[html.length] = "ng-click='nextPage((pageBlock.Index),pageBlock.EndPageNumber);'>";
    html[html.length] = "<span aria-hidden='true'>Next »</span>";
    html[html.length] = "</a>";
    html[html.length] = '</li>';
    
    //last...
    html[html.length] = '<li ng-class="{disabled:(CurrentPageIndex==pages)}">';
    html[html.length] = "<a href='javascript:void(0);' ";
    html[html.length] = self.ngStyle();
    html[html.length] = "ng-click='lastPage()'>";
    html[html.length] = "<span aria-hidden='true'>Last</span>";
    html[html.length] = "</a>";
    html[html.length] = '</li>';

    html[html.length] = '</ul>';    
    html[html.length] = '</div>';    
    html[html.length] = '</div>';    
    html[html.length] = '</div>';
    console.log(html.join(""));
    $templateCache.put('pankajunhale-custom-pager.htm', html.join(""));
    
}])
.directive('customPager', ['$sce', '$timeout', '$templateCache', function($sce, $timeout, $templateCache) {

    var self = {};
    self.paginationTheme = [
        {
            Name: 'Default',
            Style: {
                BackgroundColor: "",
                Color: "",
                Border: "",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'Red',
            Style: {
                BackgroundColor: "#ef4e3a",
                Color: "#FFF",
                Border: "1px #cc2311 solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'Green',
            Style: {
                BackgroundColor: "#1D8A11",
                Color: "#FFF",
                Border: "1px #1D8A11 solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'LightGreen',
            Style: {
                BackgroundColor: "#699613",
                Color: "#FFF",
                Border: "1px #699613 solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'Orange',
            Style: {
                BackgroundColor: "#f0b840",
                Color: "#FFF",
                Border: "1px #d39211 solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'Blue',
            Style: {
                BackgroundColor: "#4a87ee",
                Color: "#FFF",
                Border: "1px #145fd7 solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'Black',
            Style: {
                BackgroundColor: "#444",
                Color: "#FFF",
                Border: "1px #111 solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        },
        {
            Name: 'Purple',
            Style: {
                BackgroundColor: "#8a6de9",
                Color: "#FFF",
                Border: "1px #552bdf solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            }
        }
    ];

    self.firstPageIndex = 1;
    self.setPaginationBlockArray = function(options, applyMyStyle, color, bgColor) {

        var myPaginationWrapper, start, end, totalPageCount, totalPaginationBlockCount, style;
        var tempArray = [];
        var pages = [];
        applyMyStyle = typeof applyMyStyle !== "undefined" ? applyMyStyle : "false";

        if (applyMyStyle.toLowerCase() == "true") {
            //apply custom style
            style = {
                BackgroundColor: bgColor,
                Color: color,
                Border: "1px " + bgColor + " solid",
                MarginLeft: "4px",
                BorderRadius: "3px"
            };
        } else {
            style = self.getTheme(options.Theme);
        }

        if (options.TotalRecords > options.PageSize) {
            totalPageCount = Math.ceil(options.TotalRecords / options.PageSize);
            for (var counter = totalPageCount; counter > 0; counter--) {
                pages.push(counter);
            }
            pages = pages.reverse();

            if (totalPageCount > options.ButtonCount) {

                totalPaginationBlockCount = Math.ceil(totalPageCount / options.ButtonCount);
                for (var i = 0; i < totalPaginationBlockCount; i++) {

                    start = i === 0 ? 0 : ((i * options.ButtonCount));

                    if (i !== 0) {
                        if ((i + 1) == totalPaginationBlockCount) {
                            end = (((totalPageCount / options.ButtonCount) * options.ButtonCount));
                        } else {
                            end = ((i * options.ButtonCount) + options.ButtonCount);
                        }
                    } else {
                        end = options.ButtonCount;
                    }
                    myPaginationWrapper = {
                        Index: i,
                        IsVisible: i !== 0 ? false : true,
                        StartPageNumber: start,
                        EndPageNumber: end,
                        ThemeStyle: style,
                        Pages: pages.slice(start, end)
                    };
                    tempArray.push(myPaginationWrapper);

                }
            } else {

                myPaginationWrapper = {
                    Index: 0,
                    IsVisible: true,
                    StartPageNumber: 0,
                    EndPageNumber: totalPageCount,
                    ThemeStyle: style,
                    Pages: pages.slice(0, totalPageCount)
                };
                tempArray.push(myPaginationWrapper);
            }
        }
        return tempArray;
    };

    self.validateOptions = function(options) {

        if (typeof options.Type !== "undefined") {

            switch (options.Type.toUpperCase()) {
            case 'LG':
                options.Type = 'lg';
                break;
            case 'SM':
                options.Type = 'sm';
                break;
            default:
                options.Type = '';
                break;
            }

        } else {
            options.Type = '';
        }

        options.Theme = typeof options.Theme !== "undefined" ? options.Theme.toUpperCase() : 'DEFAULT';
        options.ButtonCount = options.ButtonCount || 5;
        options.PageSize = options.PageSize || 10;
        options.TotalRecords = options.TotalRecords || 0;
        options.Callback = typeof options.Callback !== "function" ? alert('callback is undefined...') : options.Callback;
        console.log(options);
        return options;
    };
    self.userResult = function(currentPageIndex) {
        var data = {
            CurrentPageIndex: currentPageIndex
        };
        return data;
    };
    self.getTheme = function(theme) {
        var data;
        var isThemeExist = false;
        angular.forEach(self.paginationTheme, function(item) {
            if (item.Name.toUpperCase() == theme.toUpperCase()) {
                isThemeExist = true;
                data = item.Style;
            }
        });
        if (!isThemeExist) {
            data = self.getDefaultTheme();
        }
        return data;
    };
    self.getDefaultTheme = function() {
        var data;
        angular.forEach(self.paginationTheme, function(item) {
            if (item.Name.toUpperCase() == "DEFAULT") {
                data = item.Style;
            }
        });
        return data;
    };
    return {
        restrict: 'AE',
        scope: {
            options: '=',
            applyStyle: '@',
            color: '@',
            bgColor: '@'
        },
        //template: $templateCache.get('pankajunhale-custom-pager.htm'),

        link: function($scope, element, attrs) {
            var scope = $scope;
            scope.ShowPager = false;
            scope.Pagination = [];
            scope.pages = 0;
            scope.totalPageBlocks = 0;
            scope.CurrentPageIndex = 1;
            scope.previousPageButtonVisible = false;
            scope.nextPageButtonVisible = true;
            var options = scope.options;
            

            //methods
            scope.init = function() {
                //validated otpions
                console.log('init...');
                options = self.validateOptions(options);
                //set pagination array
                scope.Pagination = self.setPaginationBlockArray(options, scope.applyStyle, scope.color, scope.bgColor);
                angular.forEach(scope.Pagination, function(item) {
                    scope.pages = scope.pages + item.Pages.length;
                    scope.totalPageBlocks = scope.totalPageBlocks + 1;
                });
                scope.ShowPager = scope.pages > 0 ? true : false;
                console.log('Data:', angular.toJson(scope.Pagination), 'Pages:', scope.pages, 'PageBlocks:', scope.totalPageBlocks, 'Show:', scope.ShowPager, 'applyCustomStyle', scope.applyStyle);
            };
            //DOM Ready
            angular.element(document).ready(function() {
                //scope.init();
            });
            scope.init();
            scope.firstPage = function() {
                if (scope.CurrentPageIndex != 1) {
                    scope.CurrentPageIndex = 1;
                    scope.displayCurrentPageBlock(0);
                    options.Callback(self.userResult(scope.CurrentPageIndex));
                }
            };
            scope.lastPage = function() {
                if (scope.CurrentPageIndex != scope.pages) {
                    scope.CurrentPageIndex = scope.pages;
                    scope.displayCurrentPageBlock(scope.totalPageBlocks - 1);
                    options.Callback(self.userResult(scope.CurrentPageIndex));
                }
            };
            scope.nextPage = function(pageBlockIndex, endPageNumber) {

                if (scope.CurrentPageIndex == scope.pages)
                    return false;

                scope.CurrentPageIndex = scope.CurrentPageIndex + 1;
                scope.previousPageButtonVisible = true;
                if (scope.CurrentPageIndex > endPageNumber) {
                    scope.displayCurrentPageBlock(pageBlockIndex + 1);
                }

                options.Callback(self.userResult(scope.CurrentPageIndex));
            };
            scope.previousPage = function(pageBlockIndex, startPageNumber) {

                if (pageBlockIndex == 0 && scope.CurrentPageIndex == self.firstPageIndex)
                    return false;

                scope.CurrentPageIndex = scope.CurrentPageIndex - 1;

                if (scope.CurrentPageIndex == 1) {
                    scope.previousPageButtonVisible = false;
                }

                if (scope.CurrentPageIndex <= startPageNumber) {
                    scope.displayCurrentPageBlock(pageBlockIndex - 1);
                }

                options.Callback(self.userResult(scope.CurrentPageIndex));
            };
            scope.goToPage = function(page) {
                scope.CurrentPageIndex = page;

                if (scope.CurrentPageIndex == 1) {
                    scope.previousPageButtonVisible = false;
                }
                if (scope.CurrentPageIndex > 1) {
                    scope.previousPageButtonVisible = true;
                }
                if (scope.CurrentPageIndex == scope.pages.length) {
                    scope.nextPageButtonVisible = false;
                } else {
                    scope.nextPageButtonVisible = true;
                }

                options.Callback(self.userResult(scope.CurrentPageIndex));

            };

            scope.displayCurrentPageBlock = function(pageBlockIndex) {

                angular.forEach(scope.Pagination, function(item, index) {
                    if (pageBlockIndex == index)
                        item.IsVisible = true;
                    else
                        item.IsVisible = false;
                });
            };

            scope.reloadPager = function() {
                console.log('reloading pager');
            };
            scope.$watch('options', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    scope.totalPageBlocks = 0;
                    scope.pages = 0;
                    scope.init();
                    scope.firstPage();
                }
            }, true);
        },
        template: function(element, attrs) {
            element.html($templateCache.get('pankajunhale-custom-pager.htm'));
        }
    };
}]);
    

