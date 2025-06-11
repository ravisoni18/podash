sap.ui.define([
	"sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
   
], function(
	Controller,JSONModel,MessageBox
) {
	"use strict";

	return Controller.extend("project1.controller.Login", {


         onInit: function () {

            // firebase config. These should be determined from your own
      // firebase database in the firebase console.
      var oFBConfig = {
  apiKey: "AIzaSyBN2xRKubFHPJ299sY94rQVqcrSri_kItI",
  authDomain: "ui5podash.firebaseapp.com",
  projectId: "ui5podash",
  storageBucket: "ui5podash.firebasestorage.app",
  messagingSenderId: "1025543753909",
  appId: "1:1025543753909:web:5dc32b9d7dd6928a746efc",
  measurementId: "G-BP5QM22RT8"
};

      firebase.initializeApp(oFBConfig);
			
			// Create a Firestore reference
			const firestore1 = firebase.firestore();
			
			// Firebase services object
			const oFirebase = {
				firestore: firestore1
			};
			
			// Create a Firebase model out of the oFirebase service object which contains all required Firebase services
			var fbModel = new JSONModel(oFirebase);
			
			


      this.getView().setModel(fbModel,"firebase");


      const firebaseModel = this.getView().getModel("firebase");
			
	// Create a Firestore reference
	const firestore = this.getView().getModel("firebase").getData().firestore;

     const collRefShipments = firestore.collection("usercreds");
     this.getUsers(collRefShipments);

      var that = this;
     if(document.cookie.includes("isloggedin:true")){
      setTimeout(() => {
        
        sap.m.MessageToast.show("Successful Login - "+document.cookie.split("email:")[1],{duration:5000,animationDuration: 3000});
         var oRouter = that.getOwnerComponent().getRouter();
                oRouter.navTo("View1");
      }, 1000);
     }
        },

        getUsers: function (collRefShipments) {
	collRefShipments.get().then(
		function (collection) {
	
			var shipments = collection.docs.map(function (docShipment) {
						return docShipment.data();
					});

                          this.getView().setModel(new sap.ui.model.json.JSONModel(
                   { "users":shipments}
                ), "userModel");
         
			
          
	}.bind(this));
},
        onEmailSignin: function (oEvent) {

             
                var dataArray = this.getView().getModel("userModel").getData().users
                var user = this.getView().byId("idu_admin").getValue();
                var password = this.getView().byId("idp_admin").getValue();
           var length= dataArray.filter(obj => (obj.email.toUpperCase() === user.toUpperCase() && obj.password === password)).length;

            if(length >=1){

                let prodSet = this.getOwnerComponent().getModel("loginModel");
                prodSet.setProperty("/isLogggedIn", true);
                prodSet.setProperty("/email", user);
              MessageBox.success("Successful Login")
              document.cookie = "isloggedin:true,email:"+user;
              var oRouter = this.getOwnerComponent().getRouter();// take them to the next page
                oRouter.navTo("View1");
            }else{
               MessageBox.error("Failed Login")
  document.cookie = "isloggedin:false,email:"+null;
                let prodSet = this.getOwnerComponent().getModel("loginModel");
                prodSet.setProperty("/isLogggedIn", false);
                prodSet.setProperty("/email", null);
            }


                

                return;
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var email = this.byId("idu_admin").getValue();
            var password = this.byId("idp_admin").getValue();
            var errorMessage = "";
            // Create a Fireauth Auth reference
            var oModel = this.getView().getModel("fbModel").getData();
            var fireAuth = oModel.fireAuth;
            var firestoreData = oModel.firestore;
            fireAuth.signInWithEmailAndPassword(email, password).then(function (usersigned) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.success("You are Logged in!");
                that.onReset();
            }).catch(function (error) {
                sap.ui.core.BusyIndicator.hide();
                // Handle Errors here.
                errorMessage = error.message;
                MessageBox.error(errorMessage);
            });
        },
        onReset: function (oEvent) {
            this.byId("idu_admin").setValue("");
            this.byId("idp_admin").setValue("");
        }
	});
});