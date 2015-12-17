/**
 * Created by bai on 2015/9/7.
 */
Util = {
    modal: function (title, content) {
        $('#modalTitle').text(title)
        $('#modalContent').text(content)
        $('#modal').modal()
    },
    // downloadFile(fileName, content) {
    //     var aLink = document.createElement('a');
    //     var blob = new Blob([content]);
    //     var evt = document.createEvent("HTMLEvents");
    //     evt.initEvent("click", false, false);
    //     aLink.download = fileName;
    //     aLink.href = URL.createObjectURL(blob);
    //     aLink.dispatchEvent(evt);
    // }
}