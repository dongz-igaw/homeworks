'use strict';

define(['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('upload', {
            init: function init(element) {
                var context = this;
                var options = context.local._options;

                element.bind('change', function () {
                    var $this = $(this);

                    if ($this.val() !== '') {
                        context.local._prototype.upload.apply(context, [].concat($this, options, Array.prototype.slice.call(arguments, 2)));
                    }
                });
            },
            method: {
                upload: function upload(element, options) {
                    var context = this;

                    var file = element[0].files[0];
                    var info = {
                        name: file.name,
                        size: file.size,
                        type: file.type.split('/')[file.type.split('/').length - 1],
                        exts: file.name.split('.')[file.name.split('.').length - 1]
                    };
                    var exts = {
                        txt: ['TXT', 'LOG'],
                        img: ['JPEG', 'JPG', 'JPE', 'PJPEG', 'PNG', 'GIF', 'BMP', 'RAW'],
                        doc: ['DOC', 'DOCX', 'PPT', 'PPTX', 'HWP', 'XLS', 'XLSX', 'PDF', 'CSV'],
                        flag: {
                            txt: 'Text',
                            img: 'Image',
                            doc: 'Doc',
                            spread: 'Spread'
                        },
                        dest: {
                            local: 'Local',
                            s3: 'AWSS3'
                        }
                    };

                    if (typeof options.type !== 'undefined' && options.type !== null) {
                        if ($.inArray(options.type, Object.keys(exts)) !== -1) {
                            if ($.inArray(info.type.toUpperCase(), exts[options.type]) !== -1) {
                                var idx = null;
                                if ($.inArray(info.exts.toUpperCase(), exts[options.type]) !== -1) {
                                    var form = new FormData();
                                    form.append('file', file, file.name);
                                    if (typeof options.type !== 'undefined' && options.type !== null) {
                                        form.append('type', exts.flag[options.type]);
                                    }

                                    if (typeof options.dest !== 'undefined' && options.dest !== null) {
                                        form.append('dest', exts.dest[options.dest]);
                                    }

                                    if (typeof options.data !== 'undefined') {
                                        for (idx in options.data) {
                                            form.append(idx, options.data[idx]);
                                        }
                                    }

                                    if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                        element.siblings('.btn').text('업로드 중').addClass('btn-default').removeClass('btn-success btn-danger');
                                    }

                                    if (typeof options.beforeStart === 'function') {
                                        options.beforeStart.apply(element, Array.prototype.slice.call(arguments));
                                    }

                                    if (typeof options.extensions !== 'undefined') {
                                        for (idx in options.extensions) {
                                            var item = options.extensions[idx];
                                            form.append(idx, item);
                                        }
                                    }

                                    $.ajax({
                                        url: options.url,
                                        data: form,
                                        type: 'POST',
                                        contentType: false,
                                        processData: false,
                                        mimeType: 'multipart/form-data',
                                        dataType: 'json',
                                        timeout: 30000,
                                        complete: options.complete,
                                        success: function success(data, status, xhr) {
                                            var result = data.data;

                                            if (data.code === 200) {
                                                element.val('');

                                                if (options.type === 'img') {
                                                    if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                                        element.siblings('.btn, img').remove();
                                                        element.before('<img src="' + result.data + '" />');
                                                    }
                                                } else {
                                                    if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                                        element.siblings('.btn').text('완료').removeClass('btn-default btn-danger').addClass('btn-success');
                                                    }
                                                }

                                                element.data('value', result.data);

                                                if (typeof options.success === 'function') {
                                                    options.success.apply(element, Array.prototype.slice.call(arguments));
                                                }
                                            } else {
                                                if (typeof result.msg !== 'undefined') {
                                                    toast(result.msg);
                                                }
                                            }
                                        },
                                        error: function error(xhr, status, _error) {
                                            toast('Unexpected error are occured when uploading.');
                                            if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                                element.siblings('.btn').text('Error').removeClass('btn-default btn-success').addClass('btn-danger');
                                            }
                                            if (typeof options.error === 'function') {
                                                options.error.apply(element, Array.prototype.slice.call(arguments));
                                            }
                                        }
                                    });
                                } else {
                                    toast('.' + info.exts + '은 업로드를 지원하는 확장자가 아닙니다.');
                                }
                            } else {
                                toast('.' + info.exts + '은 업로드를 지원하는 확장자가 아닙니다.');
                            }
                        } else {
                            toast(options.type + '은 허용하는 확장자 옵션 정의가 아닙니다.');
                        }
                    } else {
                        // Write some codes here.
                    }
                }
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
