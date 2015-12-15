/**
 * Created by bai on 2015/8/21.
 */
//΢�Žӿ�

//1,login

//2,logout

//3,subscribe

//4,getData


//5,pushData


Api.addRoute('test/', {
    get: function () {
        return mysql.getPollutant();
    }
})