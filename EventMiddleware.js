/**
 * Sc7 2019.8.15
 * 事件驱动中间件
 */

(function () {
    function EventMiddleware(eventContext) {
        var context = this;
        context._middlewareArray = [];
        context._middlewareStartArray = [];
        context._endMiddleware = (context) => console.log("事件驱动中间件文档参考: https://github.com/Sc7/EventMiddleware");
        context._eventContext = eventContext;
    }

    window.EventMiddleware = EventMiddleware;

    EventMiddleware.prototype.run = function () {
        var context = this;
        isOnly(context._start);
        context._start = true;
        context._next = context.AOP();
        context._next(context._eventContext);
    }

    EventMiddleware.prototype.AOP = function () {
        var context = this, middlewareArray = context._middlewareArray, middlewareStartArray = context._middlewareStartArray;

        //事件中间件
        if (context._eventMiddleware)
            middlewareArray.unshift(context._eventMiddleware);

        //useStart中间件
        middlewareArray = middlewareStartArray.concat(middlewareArray);

        //第一个中间件
        if (context._oneMiddleware)
            middlewareArray.unshift(context._oneMiddleware);

        //最后一个中间件，并且按序合并了所有中间件
        //var next = (context) => console.log("事件驱动中间件文档参考: https://github.com/Sc7/EventMiddleware");
        var next = context._endMiddleware;

        middlewareArray.reverse();

        middlewareArray.forEach(function (middleware) {
            next = middleware(next);
        });
        return next;
    }

    //第一个执行的中间件，useStart之前，只执行一次
    EventMiddleware.prototype.one = function (middleware) {
        isOnly(this._oneMiddleware);
        this._oneMiddleware = middleware;
        return this;
    }

    //在事件中间件之前执行，并且只执行一次
    EventMiddleware.prototype.useStart = function (middleware) {
        this._middlewareStartArray.push(middleware)
        return this;
    }

    //事件中间件,一个中间件实例只允许一个事件中间件，useStart之后
    EventMiddleware.prototype.useEvent = function (middleware) {
        isOnly(this._eventMiddleware);
        this._eventMiddleware = middleware;
        return this;
    }

    //事件中间件触发时执行
    EventMiddleware.prototype.use = function (middleware) {
        this._middlewareArray.push(middleware);
        return this;
    }

    //事件中间件触发时执行,use之后
    EventMiddleware.prototype.end = function (middleware) {
        this._endMiddleware = middleware;
        return this;
    }


    //是否唯一
    function isOnly(obj) {
        if (obj) {
            var msg = '只能初始化一次！';
            myAlert(msg);
            abort(msg);
        }
    }

    function myAlert(msg) {
        alert(msg)
    }

    function abort(msg) {
        throw msg;
    }

})()

/**
 Demo:
 1、 定义事件元素，实例化中间件
    <button type="button" id="btn1" class="btn btn-primary" style="width:100px;text-align:center;margin:auto;">Start</button>
    var i = 0;
    var mw=new EventMiddleware($("#btn1"));

 2、自定义中间件,调用next(context)执行下一个中间件,return则终止中间件执行
  2.1、自定义初始化中间件（中间件实例过程中只会执行一次）
     mw.one((next) => (context) => { console.log("第一个执行"); next(context) })
       .useStart((next) => (context) => { console.log("只执一次1"); next(context) })
       .useStart((next) => (context) => { console.log("只执一次2"); next(context) })

  2.2、事件中间件，只能定义一个
     mw.useEvent((next) => (context) => { context.click(() => { console.log("执行" + ++i + "次点击事件"); next(context) }) })

  2.3、触发事件之后执行的中间件
     mw.use((next) => (context) => { console.log("触发中间件1"); next(context) })
       .use((next) => (context) => { console.log("触发中间件2"); next(context) })

  2.4、去最后一个中间件提示
     //mw.end((next) => (context) => { })

 3、启动中间件
     mw.run()
 */