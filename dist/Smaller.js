(function (global, factory) {

    if (typeof define === "function" && define.amd) {

        define(['exports'], factory);

    } else if (typeof exports !== "undefined") {

        factory(exports);

    } else {

        var mod = {

            exports: {}

        };

        factory(mod.exports);

        global.Smaller = mod.exports.default;

    }

})(this, function (exports) {

    'use strict';



    Object.defineProperty(exports, "__esModule", {

        value: true

    });



    function _classCallCheck(instance, Constructor) {

        if (!(instance instanceof Constructor)) {

            throw new TypeError("Cannot call a class as a function");

        }

    }



    var _createClass = function () {

        function defineProperties(target, props) {

            for (var i = 0; i < props.length; i++) {

                var descriptor = props[i];

                descriptor.enumerable = descriptor.enumerable || false;

                descriptor.configurable = true;

                if ("value" in descriptor) descriptor.writable = true;

                Object.defineProperty(target, descriptor.key, descriptor);

            }

        }



        return function (Constructor, protoProps, staticProps) {

            if (protoProps) defineProperties(Constructor.prototype, protoProps);

            if (staticProps) defineProperties(Constructor, staticProps);

            return Constructor;

        };

    }();



    var Smaller = function () {

        /*

         * option {

         *   src: 图片地址

         *   file: 文件对象

         *   el: input[file]节点

         *   scale: 压缩比例 0 - 1

         * }

         * */

        function Smaller() {

            var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};



            _classCallCheck(this, Smaller);



            this.src = option.src;

            this.file = option.file;

            this.el = option.el;

            this.scale = option.scale || 1;

            this.success = option.success;

            if (!this.src && !this.el && !this.file) return {};

            this.init();

        }



        _createClass(Smaller, [{

            key: 'init',

            value: function init() {

                this.src ? this.compressImg(this.src,this.file) : this.file ? this.fileReader(this.file) : this.fileReader(this.getFile(this.el));

            }

        }, {

            key: 'getFile',

            value: function getFile(el) {

                var file = void 0;

                try {

                    if (el.files && el.files[0]) {

                        file = el.files[0];

                    } else if (el.files && el.files.item(0)) {

                        file = el.files.item(0);

                    }

                    return file;

                } catch (e) {

                    console.log(e);

                }

            }

        }, {

            key: 'fileReader',

            value: function fileReader(file) {
                var _this = this;
                var src = '';
                var Orientation = '';
                try {
                    try {
                        src = file.getAsDataURL();
                    } catch (e) {
                        src = window.URL.createObjectURL(file);
                    }
                    var image = new Image(),
                        canvas = document.createElement("canvas"),
                        ctx = canvas.getContext('2d');
                    image.src = src;
                    EXIF.getData(file, function () {
                            var Orientation = EXIF.getTag(this, 'Orientation');
                            console.log('orientation:' + Orientation);
                        setTimeout(function(){
                            console.log('orientation:' + Orientation);
                            _this.compressImg(src,Orientation);
                        },500)
                        }
                    );
                } catch (e) {

                    try {

                        var reader = new FileReader();

                        reader.onload = function (e) {

                            src = e.target.result;
                            var image = new Image(),
                                canvas = document.createElement("canvas"),
                                ctx = canvas.getContext('2d');
                            image.src = src;
                            EXIF.getData(file, function () {
                                    var Orientation = EXIF.getTag(this, 'Orientation');
                                    console.log('orientation:' + Orientation);
                                    setTimeout(function(){
                                        console.log('orientation:' + Orientation);
                                        _this.compressImg(src,Orientation);
                                    },500)
                                }
                            );
                            // _this.compressImg(src);

                        }
                        reader.readAsDataURL(file);

                    } catch (e) {

                        console.log(e);

                    }

                }

            }

        }, {

            key: 'compressImg',

            value: function compressImg(src,Orientation) {

                var _this2 = this;
                console.log(Orientation);
                var image = new Image(),
                    canvas = document.createElement("canvas"),
                    ctx = canvas.getContext('2d');
                image.src = src;

                image.onload = function () {
                    var w = image.width,
                        h = image.height;
                    console.log(image.width);
                    console.log(image.height);
                    if(Orientation == '6'){
                        canvas.width = h;
                        canvas.height = w;
                        ctx.rotate(Math.PI / 2);
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, -canvas.width, canvas.height, canvas.width);
                    }
                    else if(Orientation == '8'){
                        canvas.width = h;
                        canvas.height = w;
                        ctx.rotate(-90 * Math.PI / 180);
                        ctx.drawImage(image, 0, 0, image.width, image.height, -canvas.height, 0, canvas.height, canvas.width);
                    }
                    else{
                        canvas.width = w;
                        canvas.height = h;
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
                    }
                    var dataURL = canvas.toDataURL(_this2.file.type, _this2.scale);
                    var data = dataURL.split(',')[1];
                    data = window.atob(data);
                    var ia = new Uint8Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        ia[i] = data.charCodeAt(i);
                    }
                    var blob = new Blob([ia], { type: _this2.file.type });
                    if (_this2.success) _this2.success({ url: dataURL, file: blob });
                };
            }
        }]);
        return Smaller;
    }();
    exports.default = Smaller;
});

