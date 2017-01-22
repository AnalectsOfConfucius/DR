$(function () {
    $.ajax({
        url: window.apiPoint + 'tasks',
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var result = {};
                result["tasks"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each tasks as it,index}',
                    '<option value="${it.id}">${it.taskName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
                $('.chosen-select').chosen({});
            }
        },
    });
});