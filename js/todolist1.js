$(function () {
    // 按下回车，点击复选框，都是把本地存储的数据加载到页面中，这样保证刷新关闭页面不会丢失数据
    // 用数组形式存储数据 
    // 本地存储只能存储字符串形式 通过JSON.stringify(),将数组对象转化为字符串形式存储
    // 获取本地存储数据，需要把字符串数据转换为对象格式 JSON.parse()
    load();
    $("#title").on("keydown", function (event) {
        if ($(this).val() === "") {
            alert("请输入你要的操作")
        } else {
            if (event.keyCode === 13) {
                // 用数组获取本地存储里面原来的数据
                var local = getData();
                // console.log(local);
                //把用户按回车最新数据追加给local数组
                local.push({ title: $(this).val(), done: false });
                saveData(local);
                // 把本地存储数据渲染到页面上面
                load();
                $(this).val("");
            }
        }
    })

    // 删除操作 利用事件委托绑定事件，给父元素绑定事件，传到子元素上 
    $("ol,ul").on("click", "a", function () {
        // alert("测试委托绑定")
        // 先获取本地存储
        var data = getData();
        // console.log(data);

        // 修改数据
        var index = $(this).attr("index");
        // console.log(index);
        // 删除data数组中的一条数据，再用data替换本地存储
        // 利用splice方法（从哪一个位置开始删除，删除几个元素）
        data.splice(index, 1);

        // 保存到本地存储并重新渲染
        saveData(data);
        load();

    })

    // 双击修改p(title)的内容 给p绑定双击事件
    $("ol,ul").on("dblclick", "p", function () {
        // 获取p里面内容 获取本地存储里面title内容
        var data = getData();
        var index = $(this).siblings("a").attr("index");
        var str = data[index].title;
        // var str = $(this).html();
        // 双击禁止选定文字
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        // 给当前p添加文本框
        $(this).html('<input type="text" />');
        var input = $(this).children('input');
        // 将p里面的内容添加到input里面
        input.val(str);
        // 使文本处于选定状态
        input.select();
        $(input).on('blur', function () {
            // $(this).parent().html(input.val());
            data[index].title = $(this).val();
            saveData(data);
            load();
        })
        // 按下回车自动调用失去焦点事件
        $(input).on('keyup', function (e) {
            if (e.keyCode === 13) {
                // 手动调用表单失去焦点事件  不需要鼠标离开操作
                $(this).blur();
            }
        })
        // console.log(index);
    })

    // todolist正在进行和已完成选项操作 根据标志位done决定是否完成从而决定显示位置
    $("ol,ul").on("click", "input", function () {
        // alert("测试绑定");
        // 先获取本地存储的数据
        var data = getData();

        //修改数据 可以用a的id号，不用再自定义变量
        var index = $(this).siblings("a").attr("index");
        // console.log(index);
        // done属性修改为复选框的选定状态
        data[index].done = $(this).prop("checked");
        // console.log(data);

        // 保存到本地存储并渲染
        saveData(data);
        load();
    })


    //读取本地存储的数据
    function getData() {
        var data = localStorage.getItem("todolist");
        if (data !== null) {
            // 有数据就将数据转化成对象格式返回
            return JSON.parse(data);
        } else {
            // 没有数据就返回空数组
            return [];
        }
    }

    // 保存本地存储的数据
    function saveData(data) {
        localStorage.setItem("todolist", JSON.stringify(data));
    }

    //渲染加载数据
    function load() {
        // 先读取本地存储数据
        var data = getData();
        // console.log(data);

        var todoCount = 0; // 正在进行的个数
        var doneCount = 0; // 已经完成的个数
        // 遍历数据 遍历之前先清空ol里面的元素内容，否则会导致多次渲染原来的数据
        $("ol,ul").empty();
        $.each(data, function (i, n) {
            // console.log(n);有几条数据就生成几个li 给a自定义索引
            // 根据done属性判断渲染到已完成里面还是未完成里面
            if (n.done) {
                $("ul").prepend("<li> <input type='checkbox' checked='checked'> <p>" + n.title + "</p> <a href='javascript:;' index=" + i + "> </li>");
                doneCount++;
            } else {
                $("ol").prepend("<li> <input type='checkbox'> <p>" + n.title + "</p> <a href='javascript:;' index=" + i + "> </li>");
                todoCount++;
            }
        });
        // 遍历完之后统计
        $("#todocount").text(todoCount);
        $("#donecount").text(doneCount);
    }


})