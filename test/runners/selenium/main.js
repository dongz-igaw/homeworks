var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var fse = require('fs-extra');
var webdriver = require('selenium-webdriver');
var by = webdriver.By;
var until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('firefox')
    .build();
var cwd = path.dirname(fs.realpathSync(__filename));
var output = path.join(cwd, './output');
var file = path.join(__dirname, '../../../main');
var url = 'file://' + path.join(file, './docs/css/basic/index.html');
var targets = [
    {
        id: 'grids-default'
    },
    {
        id: 'grids-horizontal-align'
    },
    {
        id: 'grids-vertical-align'
    },
    {
        id: 'grids-padding'
    },
    {
        id: 'grids-auto-grow'
    },
    {
        id: 'grids-equal-width'
    },
    {
        id: 'grids-resizable'
    },
    {
        id: 'grids-weight-count'
    },
    {
        id: 'grids-offsetting'
    },
    {
        id: 'grids-compact'
    },
    {
        id: 'typographys-headers'
    },
    {
        id: 'typographys-lists'
    },
    {
        id: 'typographys-guide'
    },
    {
        id: 'buttons-default-buttons',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-outline-buttons',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-materialized-buttons',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-rounded-buttons',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-rounded-outline-buttons',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-rounded-material-buttons',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'button-group',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'button-group-bordered',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'button-group-material',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'button-group-rounded',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-file'
    },
    {
        id: 'buttons-sizes',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-block-type-button',
        action: {
            type: 'click',
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'buttons-floating-buttons',
        action: {
            type: 'click',
            selectors: [
                '.floating'
            ]
        }
    },
    {
        id: 'labels'
    },
    {
        id: 'badges'
    },
    {
        id: 'label-sizes'
    },
    {
        id: 'badge-sizes'
    },
    {
        id: 'forms-text',
        action: {
            type: 'text',
            time: 200,
            selectors: [
                'input'
            ]
        }
    },
    {
        id: 'forms-select',
        action: {
            type: 'click',
            time: 200,
            selectors: [
                '.spinner'
            ]
        }
    },
    {
        id: 'forms-checkbox',
        action: {
            type: 'click',
            selectors: [
                'label'
            ]
        }
    },
    {
        id: 'forms-toggle',
        action: {
            type: 'click',
            selectors: [
                '.toggle'
            ]
        }
    },
    {
        id: 'forms-dropdown',
        action: {
            type: 'click',
            time: 500,
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'toasts-default',
        action: {
            type: 'click',
            time: 800,
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'notifications-default',
        action: {
            type: 'click',
            time: 1000,
            selectors: [
                '.btn'
            ]
        }
    },
    {
        id: 'tables-default-table'
    },
    {
        id: 'tables-striped-table'
    },
    {
        id: 'tables-hover-table'
    },
    {
    	id: 'tables-fixed-size'
    },
    {
        id: 'pagination-default',
        action: {
            type: 'click',
            selectors: [
                '.pagination a'
            ]
        }
    },
    {
        id: 'tab-default',
        action: {
            type: 'click',
            time: 1000,
            selectors: [
                '.tab-item'
            ]
        }
    },
    {
        id: 'panels-default'
    },
    {
        id: 'modals-default',
        action: {
            type: 'click',
            selectors: [
                '.btn-force'
            ]
        }
    },
    {
        id: 'colors-palette',
        action: {
            type: 'click',
            time: 500,
            selectors: [
                '.color'
            ]
        }
    }
];

function makeRandomPath(job, index) {
    let hash = crypto.createHash('sha1').update(Math.random() + (new Date()).toString()).digest('hex');
    return path.join(output, `./${index}_${job}_${hash}.png`);
}

function job(_index) {
    let index = _index || 0;
    let thenable = new Promise((resolve, reject) => {
        if (index + 1 > targets.length) {
            resolve();
        }

        let target = targets[index];
        let id = target.id;
        let action = target.action;

        driver.findElement(by.id(id)).then((elem) => {
            driver.executeScript('arguments[0].scrollIntoView()', elem);
            elem.findElements(by.css('.view-source')).then((elems) => {
                elem.takeScreenshot().then((data, err) => {
                    fs.writeFile(makeRandomPath(target, index), data, 'base64', (err) => {
                        driver.sleep(500).then(() => {
                            for(let idx in elems) {
                                elems[idx].click();
                            }

                            let complete = (wait) => {
                                driver.sleep(wait).then(() => {
                                    job(index + 1).then(() => {
                                        resolve();
                                    });
                                });
                            };

                            let waitTime = 0;

                            driver.sleep(800).then(() => {
                                if(typeof action === 'object' && typeof action.selectors !== 'undefined') {
                                    let thenables = [];
                                    let type = action.type;
                                    
                                    for(let idx in action.selectors) {
                                        var selector = action.selectors[idx];
                                        thenables.push(elem.findElements(by.css(selector)));
                                    }

                                    Promise.all(thenables).then((selectedElemsArgs) => {
                                        let selectedElems = [];
                                        let extraWaitGap = action.time || 100;
                                        let extraWaitTime = 0;

                                        for(let idx in selectedElemsArgs) {
                                            selectedElems = selectedElems.concat(selectedElemsArgs[idx]);
                                        }

                                        extraWaitTime = selectedElems.length * extraWaitGap;

                                        for(let idx in selectedElems) {
                                            (() => {
                                                let index = idx;
                                                setTimeout(() => {
                                                    driver.executeScript('arguments[0].scrollIntoView()', selectedElems[index]);
                                                    if(type === 'click') {
                                                        selectedElems[index].click();
                                                    } else if(type === 'text') {
                                                        selectedElems[index].sendKeys('Hello HOMEWORKS!');
                                                    }
                                                }, extraWaitGap * (index - 1));
                                            })();
                                        }

                                        complete(waitTime + extraWaitTime);
                                    });
                                } else {
                                    complete(waitTime);
                                }
                            });
                        });
                    });
                });
            });
        });
    });

    return thenable;
}

fse.remove(output, (err) => {
    var next = new Promise((resolve, reject) => {
        if(err) {
            console.log(err);
            resolve();
        } else {
            fse.mkdir(output, (err) => {
                resolve();
            });
        }
    });

    next.then(() => {
        driver.get(url).then(() => {
            driver.wait(until.titleIs('HOMEWORKS FRAMEWORK'), 5000).then(() => {
                job().then(() => {
                    console.log('CURRENT HOMEWORKS VERSION IS AWESOME!\nAll tests is passed!')
                    driver.quit();
                });
            });        
        });
    });
});
