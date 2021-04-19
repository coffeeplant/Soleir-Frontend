// CONFIG 
//GraphQL api address, the same url for all requests
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
}//end of if appointments














if (document.getElementById('appointment')) {
//vue instance called appointment
  var appointment = new Vue({
      el: '#appointment', //(el, data, methods, mounted)
      data () {
          return {
            //setting up the properties in the appointment instance, null at first
              apptID: null,
              appointment : null,
              editing : false
          }
        },//end of data object
      methods : {
        editNote () {
          console.log('editNote');
          this.editing = true;



        },
        //the graphql mutation is sent when the user hits the save button
        //the mutation edits the note content and return the apptID and updated note in the same query
        saveNote () {
          console.log('saveNote');
          this.editing = false;
          //js library for making http requests
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
          //the empty note should be updated to the database
          console.log('deleteNote');
          this.editing = false;
        }
      },//end of methods
      mounted () {
        console.log('SoleirAPI, ', SoleirAPI);
        //extracts apptid from the url, userid is not passed into the url, considering how
        //toekns can be used correctly here
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
      }//end of mounted
    });

}//end of if appointment








