// CONFIG 

var SoleirAPI = 'http://localhost:8080/graphql';








if (document.getElementById('appointments')) {
var appointments = new Vue({
      el: '#appointments',
    data () {
        return {
            info: null,
            data : {
              // apptByUserID: null,
              userByID: null
            }
        }
      },
    mounted () {
      console.log('SoleirAPI, ', SoleirAPI);
      axios({
        // url: 'http://app-soleir-spring-graphql.azurewebsites.net/graphql',
        url: SoleirAPI,
        method: 'post',
        data: {
          query: `
            { 
             userByID(userID: 1) {
              userID
              appointment {
                apptID
                apptdatetime
                clinic
                staff {
                  firstname
                  surname
                  position
                }
              }
            }
            }
            `
        }




      }).then((result) => {
        console.log('result, ', result);
        this.data = result.data.data;
      })
    }
  });
}














if (document.getElementById('appointment')) {

  var appointment = new Vue({
        el: '#appointment',
      data () {
          return {
              apptID: null,
              appointment : null,
              editing : false
          }
        },
      methods : {
        editNote () {
          console.log('editNote');
          this.editing = true;



        },
        saveNote () {
          console.log('saveNote');
          this.editing = false;

          axios({
            // url: 'http://app-soleir-spring-graphql.azurewebsites.net/graphql',
            url: SoleirAPI,
            method: 'post',
            data: {
              query: `mutation 
                { 
                  editNote(input:{
                    apptID: "` +  this.apptID + `",
                    userID: 1,
                    note: "` + this.appointment.note + `" 
                  }){
                    apptID
                    note
                  }
                }
                `
            }
          }).then((result) => {
            console.log('result, ', result);
            // this.appointment = result.data.data;
          })

        },
        deleteNote () {
          console.log('deleteNote');
          this.editing = false;
        }
      },
      mounted () {
        console.log('SoleirAPI, ', SoleirAPI);
        this.apptID = window.location.hash.substr(1);
        axios({
          // url: 'http://app-soleir-spring-graphql.azurewebsites.net/graphql',
          url: SoleirAPI,
          method: 'post',
          data: {
            query: `
              { 
                apptByApptIDUserID(fkuserID: 1, apptID: "` +  this.apptID + `"){
                  apptdatetime
                  clinic
                  note
                    staff{
                      firstname
                      surname
                      position
                    }
                  }
               }
              `
          }
        }).then((result) => {



          console.log('result.data.data, ', result.data.data.apptByApptIDUserID);
          console.log(this.appointment);
          this.appointment = result.data.data.apptByApptIDUserID;

          console.log(this.appointment);
        })
      }
    });

}








