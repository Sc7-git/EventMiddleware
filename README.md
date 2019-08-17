# EventMiddleware
javascript事件驱动中间件

# **html：** #
    <button type="button" id="btn1" class="btn btn-primary" style="width:100px;text-align:center;margin:auto;">Start</button>   
    
# **js：** #
# 1、实例化中间件  # 
    var mw = new EventMiddleware($("#btn1"));
# 2、自定义中间件 #
**调用next(context)执行下一个中间件, return则终止中间件执行**
## 2.1、自定义初始化中间件（中间件实例过程中只会执行一次） ##
    mw.one((next) => (context) => { console.log("第一个执行"); next(context) })
    .useStart((next) => (context) => { console.log("只执一次1"); next(context) })
    .useStart((next) => (context) => { console.log("只执一次2"); next(context) })

## 2.2、事件中间件，只能定义一个 ##
    mw.useEvent((next) => (context) => { context.click(() => { console.log("执行" + ++i + "次点击事件"); next(context) }) })

## 2.3、触发事件之后执行的中间件 ##
    mw.use((next) => (context) => { console.log("触发中间件1"); next(context) })
    .use((next) => (context) => { console.log("触发中间件2"); next(context) })

## 2.4、去最后一个中间件提示 ##
    mw.end((next) => (context) => { })

# 3、启动中间件 #
    mw.run()

