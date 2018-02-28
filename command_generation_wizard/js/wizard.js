	
	/************************************************************************
	Title : JKS/PKCS12 Store Creation Commands Generation Wizard Java Script
	Designed & Dev By : Fernando KLC
	Dev Started Date: 14th Aug 2017
	Version : 1.0.0 
	License : Free Version
	Company : 
	Warranty : Absolute No Warranty. The Developer is not liable for 
				any damages caused during the usage or by any of these scripts.
				
	Bugs :
	
	*************************************************************************/
	
	/********************************************************************
		JAVA SCRIPT FUNCTIONS
	*********************************************************************/
	
	var lastFileName = "";
	function pickFile(fileButton){
		
		var thefile = document.getElementById(fileButton);
		thefile.click();
	}
	
	function showDir(fileButton, displayLblId){
		var pathDel = "";
		var filePath = "";
		
		var thefile = document.getElementById(fileButton);
		filePath = thefile.value;
		
		if (navigator.userAgent.indexOf("Win") != -1) pathDel = "\\";
		if (navigator.userAgent.indexOf("Mac") != -1) pathDel="/";
		
		
		document.getElementById(displayLblId).value   =  filePath.substring(0, filePath.lastIndexOf(pathDel) + 1); //thefile.files[0].name;
		
		
		//alert(pathDel);
			
	}
	
	
	
	
	function showFile(fileButton, displayLblId){
		var thefile = document.getElementById(fileButton);
		document.getElementById(displayLblId).value   = thefile.value; //thefile.files[0].name;
	}
	
	
	function showHideAlert(alertType,pageNum, blShow, alertMsg){
		
		var errorAlertId = "pg" + pageNum + "_alertError";
		var inforAlertId = "pg" + pageNum + "_alertInfo";
		
		try{
			
			if(blShow){
				
				if(alertType == "ERROR"){
					
					var e = document.getElementById(errorAlertId);
					e.style.display="block";
					e.innerHTML = alertMsg;
					
				}
				
				if(alertType == "INFO"){
					var e = document.getElementById(inforAlertId);
					e.style.display="block";
					e.innerHTML = alertMsg;
				}
			}else{
				
				if(alertType == "ERROR"){
					
					var e = document.getElementById(errorAlertId);
					e.style.display="none";
					e.innerHTML = "";
					
				}
				
				if(alertType == "INFO"){
					var e = document.getElementById(inforAlertId);
					e.style.display="none";
					e.innerHTML = "";
				}
			}
			
		}catch(err){
			//alert(err);
		}
	}
	
	function hideAllAlerts(currentPage){
		
		showHideAlert("ERROR", currentPage, false, "");
		showHideAlert("INFO", currentPage, false, "");
		
	}
	
	function replaceAll(find, replace, str){
		while(str.indexOf(find) > - 1){
			str = str.replace(find, replace);
		}
		
		return str;
	}
	
	/********************************************
	CSR Generation Commands Displaying Function
	*********************************************/
	function handleCSRCreation(){
		
		var selectedEnv = $("#idEnv input[type='radio']:checked").val();
		var email = $("#pg2_csr_email").val().trim();
		var hostName = $("#pg2_csr_hostname").val().trim(); //Added on 24th Nov  2017
		var fqdn = $("#pg2_csr_fqdn").val().trim(); // This only contains domain name after 24th Nov 2017 change
		var org = $("#pg2_csr_org").val().trim();
		var orgUnit = $("#pg2_csr_ou").val().trim();
		var cc = $("#pg2_csr_cc").val().trim();
		var state = $("#pg2_csr_st").val().trim();
		var loc = $("#pg2_csr_loc").val().trim();
		var uuid = $("#txt_pg3_csr_uid").val().trim();
		var keyAndStorePass = $("#pg2_csr_pass").val().trim();
		var filePath = $("#txtFilePath").val().trim();
		
		var inputRegEx = /[^a-zA-Z0-9-.\s\-\/]/;
		
		
		
		hideAllAlerts(5);
		
		if ((email == "") || (fqdn == "") || (org == "") || (orgUnit == "") || ( cc == "") || (state == "") || ( loc == "" ) || ( keyAndStorePass == "" )){
			
			showHideAlert("ERROR", 5, true, "Some of values are blank. Please go back to Tab (Page) 2 and fill them.");
			$("#CSRcomsPanel").hide();
			return;
		}
		
		if ( uuid == "" ) {
			showHideAlert("ERROR", 5, true, "UUID value can not be blank. Please fill it in, in Page 3.");
			$("#CSRcomsPanel").hide();
			return;
		}
		
		if(filePath.indexOf("fakepath") > -1){
			showHideAlert("ERROR", 5, true, "Please key in the files path manually as your browser does not show the actual path in Page 4.");
			$("#CSRcomsPanel").hide();	
			return;
		}
		
		if(keyAndStorePass.length<6){
			showHideAlert("ERROR", 5, true, "The password length must be at least 6 characters long. Please go back to page 2 and key in a valid password");
			$("#CSRcomsPanel").hide();
			return;
		}
		
		if(!validateCSRInputDataFields()){
			$("#CSRcomsPanel").hide();
			return;
		}
		
		/* validate for special characters */
		
		if(inputRegEx.test(hostName)){
			showHideAlert("ERROR", 5, true, "Server Name contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(fqdn)){
			showHideAlert("ERROR", 5, true, "Fully Qualified Domain Name contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(org)){
			showHideAlert("ERROR", 5, true, "Organization Name contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(orgUnit)){
			showHideAlert("ERROR", 5, true, "Organization Unit Name contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(cc)){
			showHideAlert("ERROR", 5, true, "Country Code contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(state)){
			showHideAlert("ERROR", 5, true, "State (or region) contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(loc)){
			showHideAlert("ERROR", 5, true, "Location (City name) contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(keyAndStorePass)){
			showHideAlert("ERROR", 5, true, "Password for the private key (and store [optional]) contains some invalid characters. Please go back to page 2 and correct it.");
			return;
		}
		
		if(inputRegEx.test(uuid)){
			showHideAlert("ERROR", 5, true, "CSR UID contains some invalid characters. Please go back to page 3 and correct it.");
			return;
		}
		
		/* Start replacing place holders with actual valued user has keyed in */
		
		var jksKeyStoreComTemplate = 'keytool -genkeypair -alias client -keyalg RSA -keysize 2048 -keystore [#filepath]' + selectedEnv + '_clientkeystore.jks -storepass [#password] -keypass [#password] -dname "CN=[#commonName], OU=[#OrgUnit], O=[#OrgName], L=[#Location], ST=[#State], C=[#CC], UID=[#uuid]-' + selectedEnv + '"';
		
		var keyToolCSRComTemplate = 'keytool -certreq -alias client -keystore [#filepath]' + selectedEnv + '_clientkeystore.jks -storepass [#password] -keypass [#password] -file [#filepath]' + selectedEnv + '_certreq1.csr';
		
		var keyToolExportPrivKeyComTemplate = 'keytool -importkeystore -srckeystore [#filepath]' + selectedEnv + '_clientkeystore.jks -destkeystore [#filepath]' + selectedEnv + '_client_privatekey.p12 -deststoretype PKCS12 -srcalias client -deststorepass [#password] -destkeypass [#password] -storepass [#password] -keypass [#password]';
		
		var openSSLConvertP12ToPemComTemplate = 'openssl pkcs12 -in  [#filepath]' + selectedEnv + '_client_privatekey.p12  -nodes -nocerts -out  [#filepath]' + selectedEnv + '_client_privatekey.pem';
		
		/* Open SSL com templates */
		var openSSLPrivKeyComTemplate = 'openssl genrsa -out [#filepath]' + selectedEnv + '_privatekey.pem 2048' ;
		
		var openSSLCSRComTemplate = 'openssl req -new -sha256 -key [#filepath]' + selectedEnv + '_privatekey.pem -out [#filepath]' + selectedEnv + '_certreq1.csr -subj /CN=[#commonName]/OU=[#OrgUnit]/O=[#OrgName]/L=[#Location]/ST=[#State]/C=[#CC]/UID=[#uuid]-' + selectedEnv ;

		
		/*Combine hostname and domain name. Fqdn variable only contains the domain name after 24th Nov 2017 change when read the input field.
			Therefore combine it with hostname.
		*/
		fqdn = hostName + "." + fqdn;
		
		/* Key tool */
		$("#csrOpt1Com1").text(jksKeyStoreComTemplate.replace('[#filepath]', filePath).replace('[#password]', keyAndStorePass).replace('[#commonName]', fqdn).replace('[#OrgUnit]', orgUnit).replace('[#OrgName]', org).replace('[#Location]', loc).replace('[#State]', state).replace('[#CC]', cc).replace('[#uuid]', uuid).replace('[#password]', keyAndStorePass));
		
		var temp = replaceAll('[#filepath]', filePath, keyToolCSRComTemplate);
		temp = replaceAll('[#password]', keyAndStorePass, temp);
		$('#csrOpt1Com2').text(temp);
		
		
		
		temp = "";
		temp = replaceAll('[#filepath]', filePath, keyToolExportPrivKeyComTemplate);
		temp = replaceAll('[#password]', keyAndStorePass, temp);
		$('#csrOpt1Com3').text(temp);
		
		
		
		temp = "";
		temp = replaceAll('[#filepath]', filePath, openSSLConvertP12ToPemComTemplate);
		$('#csrOpt1Com4').text(temp);
		
		
		/* openssl */
		$("#csrOpt2Com1").text(openSSLPrivKeyComTemplate.replace('[#filepath]', filePath));
		
		temp = "";
		temp = replaceAll('[#filepath]', filePath, openSSLCSRComTemplate);
		
		
		$("#csrOpt2Com2").text(temp.replace('[#commonName]', fqdn).replace('[#OrgUnit]', orgUnit).replace('[#OrgName]', org).replace('[#Location]', loc).replace('[#State]', state).replace('[#CC]', cc).replace('[#uuid]', uuid));
		
		$("#CSRcomsPanel").show();
	}
	
	/************************************************************
		JKS Generation commands displaying function
	*************************************************************/
	function handleJksStoreCreation(){
		
		var selectedCertStore = $("#idStoreType input[type='radio']:checked").val();
		var rootCertFileName = document.getElementById('RootCertFile').value;
		var geoTrustCertFileName = document.getElementById('GTCertFile').value;
		var intRootCertFileName = document.getElementById('IntRootCertFile').value;
		var projCertFileName = document.getElementById('ProjCertFile').value;
		var privateKeyFileName = document.getElementById('privKeyFile').value;
		//var d = new Date(); //This might require when create a cert bundle
		var selectedEnv = $("#idEnv input[type='radio']:checked").val();
		
		
		hideAllAlerts(5);
			
		if(selectedCertStore == "JKS"){
		
			var rootCertFilePath = rootCertFileName.replace(rootCertFileName.split('\\').pop(),''); //Root file path will be the path of new truststore.jks file path.
			var trustStoreFile = "truststore.jks";

			var modulusPrivKeyComTemplate = 'openssl rsa -noout  -modulus -in [#pemPrivateKey] | openssl dgst -sha256';
			var modulusProjCertComTemplate = 'openssl x509 -noout -modulus -in [#certfilename] | openssl dgst -sha256';
			var opensslComTemplate = 'openssl pkcs12 -export -in [#ProjCert] -inkey [#pemPrivateKey] -out [#pkcs12PrivKeyOutputPath]\key.p12'
			var certsAddComTemplate = 'keytool -import -keystore [#truststorefilename] -file [#certfilename] -alias "[#alias]"';
			var keyAddToJKSTemplate = 'keytool -importkeystore -srckeystore [#pkcs12PrivKeyOutputPath]\key.p12 -srcstoretype PKCS12 -destkeystore [#truststorefilename]'
			
			/* Validate file names */
			
			
			if(selectedEnv == "CERT" || selectedEnv == "PROD"){
				if(rootCertFileName=="" || intRootCertFileName == "" || geoTrustCertFileName=="" || projCertFileName=="" || privateKeyFileName==""){
					showHideAlert("ERROR", 5, true, "Some of certificate file names are blank. Please browse them");
					return;
				}
			}else{
				if(rootCertFileName=="" || geoTrustCertFileName=="" || projCertFileName=="" || privateKeyFileName==""){
					showHideAlert("ERROR", 5, true, "Some of certificate file names are blank. Please browse them");
					return;
				}
			}
			
			/*************************************************
			Start constructing and displaying command strings 
			*************************************************/
			
			
			/* Command to validate Cert and Private key relation ship */
			$("#oslstep1com1").text(modulusPrivKeyComTemplate.replace('[#pemPrivateKey]', privateKeyFileName));
			$('#oslstep1com2').text(modulusProjCertComTemplate.replace('[#certfilename]', projCertFileName));
			
			
			/*Convert PEM format private key to PKCS12 using OPENSSL*/
			$('#oslcom1').text(opensslComTemplate.replace('[#ProjCert]', projCertFileName).replace('[#pemPrivateKey]', privateKeyFileName).replace('[#pkcs12PrivKeyOutputPath]', rootCertFilePath));
			
			/*Add all the certificates to the truststore.jks commands*/
			
			$('#lcom1').text(certsAddComTemplate.replace('[#truststorefilename]', rootCertFilePath + trustStoreFile).replace('[#certfilename]', rootCertFileName).replace('[#alias]',"VisaRoot"));
			
			
			/* Add intermediate if CERT or PROD */
			
			if(selectedEnv == "CERT" || selectedEnv == "PROD"){
				
				$("#pg5_store_com2").show();
				$('#lcom2').text(certsAddComTemplate.replace('[#truststorefilename]', rootCertFilePath + trustStoreFile).replace('[#certfilename]', intRootCertFileName).replace('[#alias]',"VisaIntRoot"));
				
			}else{
				$("#pg5_store_com2").hide();
			}
			
			$('#lcom3').text(certsAddComTemplate.replace('[#truststorefilename]', rootCertFilePath + trustStoreFile).replace('[#certfilename]', geoTrustCertFileName).replace('[#alias]',"GeoTrust"));
			
			$('#lcom4').text(certsAddComTemplate.replace('[#truststorefilename]', rootCertFilePath + trustStoreFile).replace('[#certfilename]', projCertFileName).replace('[#alias]',"ProjCert"));
			
			/*Add the pkcs12 private key into the truststore.jks file*/
			$('#lcom5').text(keyAddToJKSTemplate.replace('[#pkcs12PrivKeyOutputPath]', rootCertFilePath).replace('[#truststorefilename]', rootCertFilePath + trustStoreFile));
			
			
			/* If path contains "Fakepath" then display the 3rd step to replace it with real directory names */
			
			if(rootCertFileName.indexOf("fakepath")>0){
				$("#pg5_step0").show();
			}else{
				$("#pg5_step0").hide();
			}
			
			/* Show the commands panel */
			$("#JKScomsPanel").show();
			
			/* Show a message at the end */
			showHideAlert("INFO", 5, true, "Successfully generated");
			
		}else{
			var fileConcatCom = "copy f1 + f2 f3";
			
		}
		
	}
	
	
	
	function saveJKSGenerationCommands(){
		
	}
	
    /* Not in use yet */
	function validateCSRInputDataFields(){
			
		var selectedEnv = $("#idEnv input[type='radio']:checked").val();
		var email = $("#pg2_csr_email").val().trim();
		var hostName = $("#pg2_csr_hostname").val().trim();
		var fqdn = $("#pg2_csr_fqdn").val().trim();
		var org = $("#pg2_csr_org").val().trim();
		var orgUnit = $("#pg2_csr_ou").val().trim();
		var cc = $("#pg2_csr_cc").val().trim();
		var state = $("#pg2_csr_st").val().trim();
		var loc = $("#pg2_csr_loc").val().trim();
		var uuid = $("#txt_pg3_csr_uid").val().trim();
		var keyAndStorePass = $("#pg2_csr_pass").val().trim();
		var filePath = $("#txtFilePath").val().trim();
		
		return true;
		
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		
		if(!re.test(email)){
			showHideAlert("ERROR", 5, true, "Invalid email address format. Please go back to page 2 and key in a valid email address.");
			$("#pg2_csr_email").addClass("input-validation-error");
			return false;
		}else{
			if($("#pg2_csr_email").hasClass('input-validation-error')){
				$("#pg2_csr_email").removeClass("input-validation-error");
			}
		}
		
		return true;

	}

	/*********************************************************
		JQUERY FUNCTIONS
	**********************************************************/
$(document).ready(function() {
		
		$('#rootwizard').bootstrapWizard({'tabClass': 'bwizard-steps'});
		window.prettyPrint && prettyPrint();
		
		
		/****************************************
		On Page 1 (Tab 1) Options Change Events
		****************************************/
		
		
		$("#idEnv").click(function(){
			//alert($("#idEnv input[type='radio']:checked").val());
			var env = $("#idEnv input[type='radio']:checked").val();
			
			if(env == 'PROD' || env == 'CERT'){
				$('#modalSelOperation').modal('show');
			}else{
				$('#modalSelOperation').modal('hide');
			}
			
		});
		
		/***********************************
			TAB Change Events Handler
		************************************/

		//On tab get focus
		$('a[data-toggle="tab"]').on('focus.bs.tab', function(e){
			//alert("test");
			$("#JKScomsPanel").hide();
			$("#CSRcomsPanel").hide();
			
		});
		
		/*
			On Tabs change
		*/
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
			
			
			var currentTab = $(e.target).text(); // get current tab
			var LastTab = $(e.relatedTarget).text(); // get last tab
			var selectedEnv = $("#idEnv input[type='radio']:checked").val();
			var selectedOp = $("#idOperation input[type='radio']:checked").val();
			
			
			/* Hide all the alerts */
			hideAllAlerts(currentTab);
			
			if(selectedEnv === undefined && currentTab > 1){
				alert("Please select an environment");
				$('#tab1').tab('show');
			}
			
			if(currentTab != 5){
				$("#CSRcomsPanel").hide();
				$("#JKScomsPanel").hide();
			}
			
			if(currentTab == 2){
				
				if(selectedEnv == "SB"){
					
					$("#privatekeymsg").html("Sandbox Private key downloaded during the project creation in VDP."); 
					var screenShot = '<div> <img src="img/projCert.png" width="379" height="110"/></div>';
					$("#projCertMsg").html("Sandbox Project / application certificate" + screenShot);
					
					/* hide the intermediate cert screen shot */
					$("#intRootCertMsg").hide();
					
					/* Show cert store speific info and hide csr specific info */
					$("#pg2_cert_store").show();
					$("#pg2_csr").hide();
					
				}else{
					
					$("#privatekeymsg").html(selectedEnv + " Environment Private key used to generate the CSR file."); 
					
					var screenShot = '<div> <img src="img/projCert.png" width="379" height="110"/></div>';
					$("#projCertMsg").html(selectedEnv + " Environment Signed project / application certificate" + screenShot);
					
					/* show the intermediate cert screen shot */
					$("#intRootCertMsg").show();
					
					
					/* Show hide CSR and store creation specific information */
					if(selectedOp == "CSR"){
						
						$("#pg2_csr").show();
						$("#pg2_cert_store").hide();
						
					}else{
						
						$("#pg2_csr").hide();
						$("#pg2_cert_store").show();
					}
					
				}
				
				
				
				
			}else if(currentTab == 3){
				
				if(selectedEnv == "SB"){
					$("#pg3_intRoot_div").hide();
					
					
					/* Show cert store speific info and hide csr specific info */
					$("#div_pg3_store_creation").show();
					$("#div_pg3_csr").hide();
					
				}else{
					

					/* Show cert store speific info and hide csr specific info */
					if(selectedOp == "CSR"){
						
						$("#div_pg3_store_creation").hide();
						$("#div_pg3_csr").show();
						
					}else{
						
						$("#pg3_intRoot_div").show();
						$("#div_pg3_store_creation").show();
						$("#div_pg3_csr").hide();
					}
					
				}
				
				
				
			}else if(currentTab == 4){
				
				
				if(selectedEnv == "SB"){
					$("#div_pg4_store").show();
					$("#div_pg4_csr").hide();
				}else{
					
					if(selectedOp == "CSR"){
						
						$("#div_pg4_store").hide();
						$("#div_pg4_csr").show();
						
					}else{
						
						$("#div_pg4_store").show();
						$("#div_pg4_csr").hide();
					}
				}
				
				
			}else if(currentTab==5){
				hideAllAlerts(5);
			}
		});
		
		
		//Environement radion button change
		
		/*
		 $('#idEnv input[type="radio"]').change(function(){
		 
			var selectedEnv = $("#idEnv input[type='radio']:checked").val();
			//alert(selectedEnv);
			if(selectedEnv == "SB"){
				$("#idCSRUID").hide();
			}else{
				$("#idCSRUID").show();
			}
		});          
		*/

	
		/*********************************************
			Button Events
		**********************************************/
		
		
		
		$("#idGenerateComsBtn").click(function()
		{
			
			var selectedOp = $("#idOperation input[type='radio']:checked").val();
			var selectedEnv = $("#idEnv input[type='radio']:checked").val();
			
			if(selectedOp == "CSR" && selectedEnv != "SB"){
				handleCSRCreation();
			}else{
				handleJksStoreCreation();
			}
			//return;

		});
		
		
		/****************************************
		  Replace full path check box event
		*****************************************/
		
		$("#idChkReplaceFullpath").click(function(){
			if($("#idChkReplaceFullpath").is(":checked")){
				$("#idBtnReplaceFakePath").html("Replace Full Path");
			}else{
				$("#idBtnReplaceFakePath").html("Replace Fakepath");
			}
		});
		
		/**********************************
		fakepath replacement button event 
		***********************************/
		$("#idBtnReplaceFakePath").click(function(){
			
			var replaceFullPath = $("#idChkReplaceFullpath").is(":checked");
			var findVal = "fakepath";
			
			var newPath = $("#txtNewPath").val();
			
			var valCom1 = $("#oslstep1com1").text();
			var valCom2 = $("#oslstep1com2").text();
			
			var convertPKCS12Com = $("#oslcom1").text();
			
			var com1 = $("#lcom1").text();
			var com2 = $("#lcom2").text();
			var com3 = $("#lcom3").text();
			var com4 = $("#lcom4").text();
			var com5 = $("#lcom5").text();
			
			/* Get full path upto the start of file name and replace it with the textbox value */
			if(replaceFullPath){
				
				var rootCertFilePathName = document.getElementById('RootCertFile').value;
				var pathDel = "/";
				
				if (navigator.userAgent.indexOf("Win") != -1) pathDel = "\\";
				if (navigator.userAgent.indexOf("Mac") != -1) pathDel="/";
		
				findVal = rootCertFilePathName.substring(0, rootCertFilePathName.lastIndexOf(pathDel) + 1);
		
			}
			
			$("#oslstep1com1").text(replaceAll(findVal,newPath, valCom1));
			$("#oslstep1com2").text(replaceAll(findVal,newPath, valCom2));
			
			$("#oslcom1").text(replaceAll(findVal, newPath, convertPKCS12Com));
			
			$("#lcom1").text(replaceAll(findVal, newPath, com1));
			$("#lcom2").text(replaceAll(findVal, newPath, com2));
			$("#lcom3").text(replaceAll(findVal, newPath, com3));
			$("#lcom4").text(replaceAll(findVal, newPath, com4));
			$("#lcom5").text(replaceAll(findVal, newPath, com5));
			
			/* hide the step 0 section */
			$("#pg5_step0").hide();
		});
		

	});
		
		$('.btn_showpath').click(function(){
			var getpath = $('.file_upfile').val();
			$('.p_upfilepath').slideUp(function(){
				$('.p_upfilepath').text('"'+getpath+'"').slideDown();
			});
		});
		
		
		
		