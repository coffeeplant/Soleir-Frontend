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
          //the empty note should be updated to the database by running the mutation again
          console.log('deleteNote');
          this.editing = false;
        }
      },//end of methods
      mounted () {
        console.log('SoleirAPI, ', SoleirAPI);
        //extracts apptid from the url, userid is not passed into the url, considering how
        //tokens can be used correctly here
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











if (document.getElementById('home')) {



      var app = new Vue({
        el: '#home',
      data () {
          return {
              login: {
                email: null,
                password: null
              }
          }
        },
      mounted () {
      },
      methods: {
        async loginUser() {
          console.log('you did the thing ' + this.login.email);
          console.log(SoleirAPI);
          axios({
            // url: 'http://app-soleir-spring-graphql.azurewebsites.net/graphql',
            url: SoleirAPI,
            method: 'post',
            data: {
              query: `mutation 
                { 
                  signinUser(input:{email:"test@userdb.com", soleirID:"UDBID001"}) {
                     token  
                     userID
                  }
                }
                `
            }
          }).then((result) => {
            if (!result.data.data.signinUser) {
              alert('ERROR');
              return;
            }
            console.log('result, ', result);
            console.log('userID, ', result.data.data.signinUser.userID);
            localStorage.setItem("user", result.data.data.signinUser.userID);
            localStorage.setItem("token", result.data.data.signinUser.token);

            console.log('localStorage' , localStorage.getItem('user'));
            console.log('localStorage token' , localStorage.getItem('token'));
            // this.appointment = result.data.data;
            window.location.replace("/appointments.html");
          })
          // try {
          //   let response = await this.$http.post("/auth/login", this.login);
          //   let token = response.data.data.token;
          //   localStorage.setItem("user", token);
          //   // navigate to a protected resource 
          //   this.$router.push("/me");
          // } catch (err) {
          //   console.log(err.response);
          // }
        }
      }
    });

}//end of if appointment





