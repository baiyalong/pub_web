/**
 * Created by bai on 2015/9/7.
 */
Util = {
    modal: function (title, content) {
        $('#modalTitle').text(title)
        $('#modalContent').text(content)
        $('#modal').modal()
    }
}