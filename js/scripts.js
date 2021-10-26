var sp=document.getElementById('splash_screen');
var fm=document.getElementById('log_form');
var mail=document.getElementById('mail');
var pass=document.getElementById('pass');
var load=document.getElementById('load_content');

var header=document.getElementById('header');
var cardent=document.getElementsByClassName('card-content');
var vcard=document.getElementById('vcard');

var btnOut=document.getElementById('btn_out');
var log=document.getElementById('alert_logout');
var blc=document.getElementById('btn_log_cancel');
var blo=document.getElementById('btn_log_out');
var bnot=document.getElementById('btn_notify');
var nim=document.getElementById('not_img');

var btni=document.getElementById('btn_increment');
var btnd=document.getElementById('btn_decrement');
var dlm=document.getElementById('data_limit');
var dvn=document.getElementById('data_vacant');
var etlm=document.getElementById('et_limit');

var db=firebase.database().ref("owl");
var isOn=true;
var c=0;
var limit=0;

var aud=new Audio('audio/alarm.mp3');

splashScreen();

fm.addEventListener('submit',function(e){
	e.preventDefault();
	showLoad();
    firebase.auth().signInWithEmailAndPassword(mail.value,pass.value).then(function(){
		hideLoad();
		sp.style.display="none";
	}).catch(function(error){
		hideLoad();
		alert(error.message);
	});
});

etlm.addEventListener('keyup',function(e){
	if(e.keyCode=="13"){
		if(etlm.value){
			db.child("limit").set(parseInt(etlm.value));
		}
		else{
			alert("Please enter the limit");
		}
	}
});
bnot.addEventListener('click',function(){
	if(isOn){
		nim.src="images/ic_alarm_disable.png";
		isOn=false;
		if(!aud.paused){
			aud.pause();
		}
	}
	else{
		nim.src="images/ic_alarm_enable.png";
		isOn=true;
	}
});
btni.addEventListener('click',function(){
	try{
	limit++;
	db.child("limit").set(limit);
	}catch(error){
		alert(error);
	}
});
btnd.addEventListener('click',function(){
	if(limit>0){
		limit--;
		db.child("limit").set(limit);
	}
});
btnOut.addEventListener('click',function(){
	showLogout();
});
blc.addEventListener('click',function(){
	hideLogout();
});
blo.addEventListener('click',function(){
	showLoad();
	firebase.auth().signOut().then(function(){
		splashScreen();
		hideLoad();
		hideLogout();
	});
});
function splashScreen(){
	sp.style.display="block";
	setTimeout(function(){
		firebase.auth().onAuthStateChanged(function(user){
			if(user){
				us=true;
				sp.style.display="none";
				header.style.display="block";
				cardent[0].style.display="flex";
				cardent[0].style.animation="zoom 1s ease-in";
				cardent[1].style.display="flex";
				cardent[1].style.animation="up 1s ease-in";
				db.on('value',function(snap){
					var data=snap.val();
					limit=data.limit;
					etlm.value=limit;
					dlm.innerText=data.inside;
					dvn.innerText=data.limit-data.inside;
					if(data.inside>limit){
						vcard.style.animation='alert 0.5s ease-in infinite';
						if(isOn){
					       aud.play();
					       aud.loop=true;
				        }
					 }
					else{
						vcard.style.animation="none";
						if(!aud.paused){
							aud.pause();
						}
					}
				});
			}
			else{
				us=false;
				fm.style.display="block";
			}
		});
},3000);
}
function showLoad(){
	load.style.display="flex";
}
function hideLoad(){
	load.style.display="none";
}
function showLogout(){
	log.style.display="flex";
}
function hideLogout(){
	log.style.display="none";
}
