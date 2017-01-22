$(function () {
    initPage(0, 10);
    $('.input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
    });
    $('.search-action').click(function () {
        initQuery(0, 10);
    });
    $('.add-two-modal').bind('click', function () {
        initAddTwo();
    });
    $('.add-two-action').bind('click', function () {
        addTwo();
    });
    $('.add-action').bind('click', function () {
        addOne();
    });
    $('.delete-action').click(function () {
        swal({
                title: "您确定要删除这条信息吗",
                text: "删除后将无法恢复，请谨慎操作！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是的，我要删除！",
                cancelButtonText: "让我再考虑一下…",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    swal("删除成功！", "您已经永久删除了这条信息。", "success");
                } else {
                    swal("已取消", "您取消了删除操作！", "error");
                }
            });
    });
});

function initAddTwo() {
    $.ajax({
        url: window.apiPoint + 'task-projects',
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result["taskProjects"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each taskProjects as it,index}',
                    '<option value="${it.id}">${it.taskProjectName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('.taskProjects').html(html);
            }
        },
    });
};

function initQuery(page, size) {
    var query = $('#query').val();
    if (query == "" || query == null) {
        initPage(0, 10);
        return;
    }
    console.log(query);
    var dataQuery = {
        page: page,
        size: size,
        query: query,
    };
    $.ajax({
        url: window.apiPoint + '_search/task-projects',
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var tpl = [
                    '{@each taskProjects as it,index}',
                    '<tr>',
                    '<td>${it.id}</td>',
                    '<td>${it.taskProjectName}</td>',
                    '<td>${it.taskProjectCheckDepartment}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" onclick="detailOne(${it.id})">详细清单</a>',
                    '<a href="javascript:;" data-toggle="modal" data-target="#myModal2">修改</a>',
                    '<a href="javascript:;" onclick="deleteOne(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, data);
                $('#tContent').html(html);
                $("#Pagination").pagination(data.totalPages, {
                    'current_page': dataQuery.page,
                    'callback': pageQuery,
                });
            }
        },
    });
};

function initPage(page, size) {
    var url = window.apiPoint + 'task-projects';
    console.log(url);
    var dataQuery = {
        page: page,
        size: size
    };
    $.ajax({
        url: url,
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                var result = {};
                result['taskProjects'] = data;
                var totalCount = xhr.getResponseHeader("X-Total-Count");
                var nowpage = parseInt(totalCount / dataQuery.size);
                console.log(nowpage);
                var tpl = [
                    '{@each taskProjects as it,index}',
                    '<tr>',
                    '<td>${it.id}</td>',
                    '<td>${it.taskProjectName}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" onclick="detailOne(${it.id})">详细清单</a>',
                    '<a href="javascript:;" onclick="deleteOne(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
                $("#Pagination").pagination(nowpage, {
                    'current_page': dataQuery.page,
                    'callback': pageSelect,
                });
            }
        },
    });
};

function pageQuery(page_index) {
    initQuery(page_index, 10);
};

function pageSelect(page_index) {
    initPage(page_index, 10);
};

function deleteOne(id) {
    swal({
            title: "您确定要删除这条信息吗",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，我要删除！",
            cancelButtonText: "让我再考虑一下…",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: window.apiPoint + 'task-projects/' + id,
                    type: 'DELETE',
                    async: true,
                    dataType: 'json',
                    complete: function (data) {
                        console.log(data);
                        if (data.status == 200 && data.statusText == "OK") {
                            swal("删除成功！", "您已经永久删除了这条信息。", "success");
                            initPage(0, 10);
                        }
                    },
                });
            } else {
                swal("已取消", "您取消了删除操作！", "error");
            }
        });
};

function deleteTwo(id) {
    swal({
            title: "您确定要删除这条信息吗",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，我要删除！",
            cancelButtonText: "让我再考虑一下…",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: window.apiPoint + 'tasks/' + id,
                    type: 'DELETE',
                    async: true,
                    dataType: 'json',
                    complete: function (data) {
                        console.log(data);
                        if (data.status == 200 && data.statusText == "OK") {
                            $('#myModal1').modal("toggle");
                            swal("删除成功！", "您已经永久删除了这条信息。", "success");
                        }
                    },
                });
            } else {
                swal("已取消", "您取消了删除操作！", "error");
            }
        });
};

function addOne() {
    var taskProjectName = $("#addFirst").find("input[name=taskProjectName]").val();
    var description = $("#addFirst").find("textarea[name=description]").val();
    var dataPost = {
        taskProjectName: taskProjectName,
        description: description
    };
    console.log(dataPost);
    $.ajax({
        url: window.apiPoint + 'task-projects',
        type: 'POST',
        // 序列化Json对象为Json字符串
        data: JSON.stringify(dataPost),
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                initPage(0, 10);
                $('#myModal0_1').modal('hide');
                $('input[name=reset]').trigger("click");
            }
        },
    });
};

function addTwo() {
    var taskName = $("#addSecond").find("input[name=taskName]").val();
    var taskContent = $("#addSecond").find("input[name=taskContent]").val();
    var lawContent = $("#addSecond").find("input[name=lawContent]").val();
    var taskCheckDepartment = $("#addSecond").find("input[name=taskCheckDepartment]").val();
    var taskProjectId = $("#addSecond").find("select[name=taskProject]").val();
    var description = $("#addSecond").find("textarea[name=description]").val();
    var taskProject = {id: taskProjectId};
    var dataPost = {
        taskName: taskName,
        taskContent: taskContent,
        lawContent: lawContent,
        taskCheckDepartment: taskCheckDepartment,
        taskProject: taskProject,
        description: description
    };
    console.log(dataPost);
    $.ajax({
        url: window.apiPoint + 'tasks',
        type: 'POST',
        // 序列化Json对象为Json字符串
        data: JSON.stringify(dataPost),
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                initPage(0, 10);
                $('#myModal0_2').modal('hide');
                $('input[name=reset]').trigger("click");
            }
        },
    });
};

function detailOne(id) {
    $.ajax({
        url: window.apiPoint + 'task/taskProject?taskProjectId=' + id,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var result = {};
                result['tasks'] = data;
                var tpl = [
                    '{@each tasks as it,index}',
                    '<tr>',
                    '<td>${it.id}</td>',
                    '<td>${it.taskName}</td>',
                    '<td>${it.taskCheckDepartment}</td>',
                    '<td>${it.taskContent}</td>',
                    '<td>{@if it.lawContent != null }${it.lawContent}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" onclick="deleteTwo(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContentChild').html(html);
            }
        },
    });
    $('#myModal1').modal("toggle");
};