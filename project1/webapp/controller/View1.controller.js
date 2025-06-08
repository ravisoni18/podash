sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageToast",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (Controller, JSONModel, Device, MessageToast,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
      
        onInit: function () {

            var data = {
	"selectedKey": "page1",
	"navigation": [
		{
			"title": "Dashboard",
			"key": "page1"
		},
		{
			"title": "Transactions",
			"key": "page2"
		},
		{
			"title": "Settings",
			"key": "page2"
		},
		{
			"title": "Item Sourcing",
			"key": "page2"
		}
		
	]
};
			var oModel = new JSONModel(data);
			this.getView().setModel(oModel);

			// Device.media.attachHandler(this._handleMediaChange, this);
			// this._handleMediaChange();
       //     this.sendXREFReqNote();
       this.salesorg = "3000";

       var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "MMddyyyy"
    });
    var sFormattedDate = oDateFormat.format(new Date());
            this.date = sFormattedDate;
            this.fetchPOs();
		},

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},

		_handleMediaChange: function () {
			var rangeName = Device.media.getCurrentRange("StdExt").name;

			switch (rangeName) {
				// Shell Desktop
				case "LargeDesktop":
					this.byId("productName").setVisible(true);
					this.byId("secondTitle").setVisible(true);
					this.byId("searchField").setVisible(true);
					this.byId("searchButton").setVisible(false);
					MessageToast.show("Screen width is corresponding to Large Desktop");
					break;

				// Tablet - Landscape
				case "Desktop":
					this.byId("productName").setVisible(true);
					this.byId("secondTitle").setVisible(false);
					this.byId("searchField").setVisible(true);
					this.byId("searchButton").setVisible(false);
					MessageToast.show("Screen width is corresponding to Desktop");
					break;

				// Tablet - Portrait
				case "Tablet":
					this.byId("productName").setVisible(true);
					this.byId("secondTitle").setVisible(true);
					this.byId("searchButton").setVisible(true);
					this.byId("searchField").setVisible(false);
					MessageToast.show("Screen width is corresponding to Tablet");
					break;

				case "Phone":
					this.byId("searchButton").setVisible(true);
					this.byId("searchField").setVisible(false);
					this.byId("productName").setVisible(false);
					this.byId("secondTitle").setVisible(false);
					MessageToast.show("Screen width is corresponding to Phone");
					break;
				default:
					break;
			}
		},

		onExit: function() {
			Device.media.detachHandler(this._handleMediaChange, this);
		},

        fetchPOs: function(){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.porky.com/sap/ZWS_PO_BAPI/ZBAPI_POZbapiWhs', true);

            if(window.location.href.includes("DE2") || window.location.href.includes("de2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'DE2');
            }else if(window.location.href.includes("QA2") || window.location.href.includes("qa2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'QA2');
            }else{
            xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            }
            xhr.setRequestHeader('X-PORKY-AUTH', 'cm1lbGxveTpsdWNreW1l');
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-PORKY-APPID', 'PO');
            xhr.setRequestHeader('X-PORKY-APIKEY', '6bb0b04a-0466-490e-a8a5-53278b3df025');
            xhr.setRequestHeader('Authorization', 'Basic cm1lbGxveTpsdWNreW1l');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var that = this;
            this.xhr = xhr;
            xhr.onload = function (e) {
                // do something to response
                //   console.log(that.xhr);
            //     console.log("Success -" + this.responseText);
            //  //   that.getView().byId("page").setTitle(this.responseText);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //         JSON.parse(this.responseText)
            //     ), "orderInfoModel");
            debugger;

            };
            xhr.onreadystatechange = function () {
                  that.getView().byId("table").setBusy(false);
                if (xhr.readyState === 4 && xhr.status === 200) {
                
                    

                    var res = JSON.parse(xhr.response);

                    that.responseOrg = JSON.parse(xhr.response);

                    res.open = res.poinfo.filter(obj => obj.grstatus === 'Open').length;
                    res.received = res.poinfo.filter(obj => obj.grstatus === 'Received').length;
                    res.invoiced = res.poinfo.filter(obj => obj.grstatus === 'Invoiced').length;
                    res.deleted = res.poinfo.filter(obj => obj.grstatus === 'Deleted').length;
  res.total = res.poinfo.length;
  res.totalfinal = that.responseOrg.poinfo.length;

                             that.getView().setModel(new sap.ui.model.json.JSONModel(
                    res
                ), "pomodel");
                    console.log(that.xhr);
                    console.log(res);
                    // debugger;
                    sap.m.MessageBox.show("Request submitted successfully");
                }
            };
            var data = { "Werks":this.salesorg, "Eindt":this.date, "Status":this.status}
             that.getView().byId("table").setBusy(true);
            xhr.send(JSON.stringify(data));
        },

        sendXREFReqNote: function () {

            debugger;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.porky.com/sap/zws_oent/ZBAPI_OENTZmmOdataent', true);

            if(window.location.href.includes("DE2") || window.location.href.includes("de2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'DE2');
            }else if(window.location.href.includes("QA2") || window.location.href.includes("qa2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'QA2');
            }else{
            xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            }
            xhr.setRequestHeader('X-PORKY-AUTH', 'cm1lbGxveTpsdWNreW1l');
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-PORKY-APPID', 'PO');
            xhr.setRequestHeader('X-PORKY-APIKEY', '6bb0b04a-0466-490e-a8a5-53278b3df025');
            xhr.setRequestHeader('Authorization', 'Basic cm1lbGxveTpsdWNreW1l');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var that = this;
            this.xhr = xhr;
            xhr.onload = function (e) {
                // do something to response
                //   console.log(that.xhr);
            //     console.log("Success -" + this.responseText);
            //  //   that.getView().byId("page").setTitle(this.responseText);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //         JSON.parse(this.responseText)
            //     ), "orderInfoModel");
            debugger;

            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                    console.log(that.xhr);
                    console.log(res);
                    // debugger;
                    sap.m.MessageBox.show("Request submitted successfully");
                }
            };
            var data = {
                "SmtpAddr": "ravi.soni@porky.com"
                };
            xhr.send(JSON.stringify(data));
        },

        onFilter: function(){

            this.salesorg = this.getView().byId("salesorg").getValue();

            if(this.salesorg === "" || typeof this.salesorg === 'undefined'){
                this.salesorg = "3000";
            }

       var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "MMddyyyy"
    });
    var sFormattedDate = oDateFormat.format(this.getView().byId("podate").getDateValue());
            this.date = sFormattedDate;
            this.status ="A";
            this.fetchPOs();
        },
        filterStatusOpen: function(){
            let oFilter = null;

                this._oGlobalFilter = new Filter([
					new Filter("grstatus", FilterOperator.Contains, "Open"),
				], false);
		

			this.byId("table").getBinding().filter(this._oGlobalFilter, "Application");

                var res = this.responseOrg ;
            res.open = res.poinfo.filter(obj => obj.grstatus === 'Open').length;
            // res.received = res.poinfo.filter(obj => obj.grstatus === 'Received').length;
            // res.invoiced = res.poinfo.filter(obj => obj.grstatus === 'Invoiced').length;
            // res.deleted = res.poinfo.filter(obj => obj.grstatus === 'Deleted').length;
res.total = res.open;

                    
        this.getView().getModel("pomodel").setProperty("/total",res.total)
        },
        filterStatusReceived: function(){
            let oFilter = null;

                this._oGlobalFilter = new Filter([
					new Filter("grstatus", FilterOperator.Contains, "Received"),
				], false);
		

			this.byId("table").getBinding().filter(this._oGlobalFilter, "Application");



            var res = this.responseOrg ;
            // res.open = res.poinfo.filter(obj => obj.grstatus === 'Open').length;
            res.received = res.poinfo.filter(obj => obj.grstatus === 'Received').length;
            // res.invoiced = res.poinfo.filter(obj => obj.grstatus === 'Invoiced').length;
            // res.deleted = res.poinfo.filter(obj => obj.grstatus === 'Deleted').length;
res.total = res.received;

                    
        this.getView().getModel("pomodel").setProperty("/total",res.total)
        },
        filterStatusInvoiced: function(){
            let oFilter = null;

                this._oGlobalFilter = new Filter([
					new Filter("grstatus", FilterOperator.Contains, "Invoiced"),
				], false);
		

			this.byId("table").getBinding().filter(this._oGlobalFilter, "Application");

            var res = this.responseOrg ;
            // res.open = res.poinfo.filter(obj => obj.grstatus === 'Open').length;
            // res.received = res.poinfo.filter(obj => obj.grstatus === 'Received').length;
            res.invoiced = res.poinfo.filter(obj => obj.grstatus === 'Invoiced').length;
            // res.deleted = res.poinfo.filter(obj => obj.grstatus === 'Deleted').length;
res.total = res.invoiced;

                    
        this.getView().getModel("pomodel").setProperty("/total",res.total)
        },
        filterStatusDeleted: function(){
            let oFilter = null;

                this._oGlobalFilter = new Filter([
					new Filter("grstatus", FilterOperator.Contains, "Deleted"),
				], false);
		

			this.byId("table").getBinding().filter(this._oGlobalFilter, "Application");



            var res = this.responseOrg ;
            // res.open = res.poinfo.filter(obj => obj.grstatus === 'Open').length;
            // res.received = res.poinfo.filter(obj => obj.grstatus === 'Received').length;
            // res.invoiced = res.poinfo.filter(obj => obj.grstatus === 'Invoiced').length;
            res.deleted = res.poinfo.filter(obj => obj.grstatus === 'Deleted').length;
res.total = res.deleted;

                    
        this.getView().getModel("pomodel").setProperty("/total",res.total)
        },

        filterStatusAll: function(){
            let oFilter = null;

                this._oGlobalFilter = new Filter([
					
				], false);
		

			this.byId("table").getBinding().filter(null, "Application");



            var res = this.responseOrg ;
            // // res.open = res.poinfo.filter(obj => obj.grstatus === 'Open').length;
            // // res.received = res.poinfo.filter(obj => obj.grstatus === 'Received').length;
            // // res.invoiced = res.poinfo.filter(obj => obj.grstatus === 'Invoiced').length;
            // res.deleted = res.poinfo.filter(obj => obj.grstatus === 'Deleted').length;
res.total= res.length;

                    
        this.getView().getModel("pomodel").setProperty("/total",res.poinfo.length)
        },

        searchFilter: function(oEvent){


            var query = oEvent.mParameters.query;

            this._oGlobalFilter = new Filter([
                new Filter("grstatus", FilterOperator.Contains, query),
                new Filter("ebeln", FilterOperator.Contains, query),
                new Filter("eindt", FilterOperator.Contains, query),
                new Filter("name1", FilterOperator.Contains, query)

            ], false);
    

        this.byId("table").getBinding().filter(this._oGlobalFilter, "Application");
        }
    });
});