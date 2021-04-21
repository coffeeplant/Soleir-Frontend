// CONFIG 
//GraphQL api address, the same url for all requests
 var SoleirAPI = 'https://soleir-api.azurewebsites.net/graphql';
//var SoleirAPI = 'http://localhost:8080/graphql';


var user = localStorage.getItem('user');
var token = localStorage.getItem('token');
// if (!token) {
//   window.location.replace("/");  
// }







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
      console.log(token);
      console.log('SoleirAPI, ', SoleirAPI);
      axios({
        // url: 'http://app-soleir-spring-graphql.azurewebsites.net/graphql',
        url: SoleirAPI,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'post',
        data: {
          query: `
            { 
              userByID(userID: ` + user + `) {
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
    },
    methods : {
        logout () {
          localStorage.setItem("user", null);
          localStorage.setItem("token", null);
          window.location.replace("/");  
        }
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
            headers: {
              'Authorization': `Bearer ${token}`
            },
            method: 'post',
            data: {
              query: `mutation 
                { 
                  editNote(input:{
                    apptID: "` +  this.apptID + `",
                    userID: "` + user + `",
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
          if (window.confirm("Delete this note?")) {
            console.log('deleteNote');
            this.editing = false;
            this.appointment.note = '';
            this.saveNote ();
          }
        },
        logout () {
          localStorage.setItem("user", null);
          localStorage.setItem("token", null);
          window.location.replace("/");  
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
          headers: {
            'Authorization': `Bearer ${token}`
          },
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
                // email: 'test@userdb.com',
                // password: 'UDBID001'
              },
              message: null
          }
        },
      mounted () {
      },
      methods: {
        async loginUser() {
          console.log('you did the thing ' + this.login.email);
          console.log('SoleirAPI');
          console.log(SoleirAPI);
          axios({
            url: SoleirAPI,
            method: 'post',
            data: {
              query: `mutation 
                { 
                  signinUser(input:{email:"` + this.login.email + `", soleirID:"`  + this.login.password + `"}) {
                     token  
                     userID
                  }
                }
                `
            }
          }).then((result) => {
            if (!result.data.data.signinUser) {
              this.message = 'Your log in details do not exist, please contact the hospital appointments department return';
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
            .catch((error) => {
              if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                console.log(this.message);
                this.message = "Site cannot connect to server";

              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
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























if (document.getElementById('hospitalInfo')) {
var hospitalInfo = new Vue({
      el: '#hospitalInfo',
        data () {
            return {
                title: null,
                data : {
                  // apptByUserID: null,
                  // userByID: null
                }
            }
          },
    mounted () {
    },
    methods : {
        logout () {
          localStorage.setItem("user", null);
          localStorage.setItem("token", null);
          window.location.replace("/");  
        }
    }
  });
}//end of if appointments


