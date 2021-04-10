var k=false;
var id = setInterval(loop, 20);
var touch=false,t=0,sldr,r,lvl=0,step=0,score=[],penalty=[],prm=[],str,mode=0,fonttype,vari=0,totalscore,waitinput=false,fontscore=[],page;
var font=['Roboto','RobotoMono','EBGaramond-VariableFont_wght','Quicksand-VariableFont_wght','Hagrid-Variable-trial','Minerale-variable-TRIAL','InterVar','Blacker-Sans-Variable-trial','GTFlexa','Compressa'];
var lvlname=['Roboto','RobotoMono','EBGaramond','Quicksand','Hagrid','Minérale','Inter','Blacker','GTFlexa','Compressa'];
var fmin=[[100],[400],[300],[100] ,[0   ],[100,0  ],[50 ,100 ],[0  ,100,0  ],[10 ,100 ]];
var fmax=[[800],[800],[700],[1000],[1000],[900,-10],[499,1000],[200,800,100],[200,1000]];
var fout;
function loop() {
	switch(mode) {
		case 0:
			page=mode;
			loadReady();
			mode++;
			break;
		case 1:
			//Wait Input
			ready();
			break;
		case 2:
			//Play Game
			level(lvl);
			break;
		case 3:
			continueLevel(lvl<4);
			if(step==Math.max(1,Math.min(lvl,4))) {
				mode++;
				k=false;
			}
			break;
		case 4:
			//Wait
			waitscore();
			break;
		case 5:
			loadCollection();
			break;
		case 6:
			//Score>settings
			loadSettings();
			//if(key=="s")
			break;
	}
	function loadReady() {
		//Load Ready?
		step=0;
		k=false;
		t=0;
		score=[];
		penalty=[];
		document.getElementById("game").style.filter="none";
		document.getElementById("headerready").style.display="flex";
		document.getElementById("headerready").children[1].children[0].innerHTML="Level "+lvl;
		document.getElementById("affiche").innerHTML="Ready?";
		document.getElementById("affiche").style.opacity=1;
		document.getElementsByClassName("slider")[0].style.opacity=1;
		if(lvl==1) {
			document.getElementById("spacebar").innerHTML="Touch the <strong>(screen)</strong><br>or Press <strong>(spacebar)</strong><br> to start";				
		} else if(touch) {
			document.getElementById("spacebar").innerHTML="Touch the <strong>(screen)</strong><br>to start";
		} else {
			document.getElementById("spacebar").innerHTML="Press <strong>(spacebar)</strong><br>to start";				
		}
		document.getElementById("spacebar").style.opacity=1;
		document.getElementById("helper").style.display="none";
		document.getElementById("helper0").style.display="none";
	}
	function ready() {
		t++;
		sldr=-Math.cos(t/200*Math.PI)/2+.5;
		document.getElementsByClassName("slider")[0].style.marginLeft=sldr*100+"%";
		if(k===" ") {
			mode++;
			t=-200;
			document.getElementById("headerready").style.display="none";
			document.getElementById("headerlevel").style.display="flex";
			document.getElementById("headerlevel").children[0].children[0].innerHTML="Level "+lvl;
			document.getElementById("headerlevel").children[0].children[1].innerHTML=0+"/"+Math.max(1,Math.min(lvl,4));
		}
		if(k=="s" ||k=="S") {
			document.getElementById("headerready").style.display="none";
			document.getElementById("game").style.filter= "blur(8px)";
			mode=6;
			k=false;
		}
		if(k=="c" ||k=="C") {
			document.getElementById("headerready").style.display="none";
			document.getElementById("game").style.filter= "blur(8px)";
			mode=5;
			k=false;
		}
	}
	function level(flash) {
		if(flash<4) {
			if(t==-200) {
				startLevel(flash);
				loadFontSettings();
				document.getElementById("affiche").style.opacity=1;
				document.getElementsByClassName("slider")[0].style.opacity=0;
				k=false;
				document.getElementById("spacebar").style.opacity=1;
				if(touch) {
					document.getElementById("spacebar").innerHTML="Click the <strong>(screen)</strong><br>to continue";
				} else {
					document.getElementById("spacebar").innerHTML="Press <strong>(spacebar)</strong><br>to continue";
				}
				t=-1;
				if(flash==3) {
					waitinput=[" "];
					clearInterval(id);
				} else {
					document.getElementsByClassName("textpar")[lvl].children[step].style.display="block";
				}
			} else if(t==0) { 
				startGame();
			}
			t++;
		}
		if(flash>3) {
			switch(t) {
				case -200:
					startLevel(flash);
					break;
				case -120:
					loadFontSettings();
					//Flash On
					document.getElementById("affiche").style.opacity=1;
					break;
				case -80:
					//Flash Off
					document.getElementById("affiche").style.opacity=0;
					break;
				case 0:
					startGame();
					break;
			}
			t++;
		}
		
		if(0<t) {
			if(k===" ") {
				saveScore();
				mode++;
				t=0;
			} else {
				moveGame(flash);
			}
		}
	}
	function continueLevel(wait) {
		if(wait &&t==0) {
			t=100
			waitinput=[" "];
			clearInterval(id);
		} else if(t==100) {
			if(vari==fonttype.length-1) {
				resetAdvance();
			} else {
				advanceVarType();
			}
			mode--;
		} else {
			t++;
		}
	}
	function startLevel(flash) {
		score.push([]);
		penalty.push(0);
		if(flash==0) {
			document.getElementById("helper0").style.display="block";
		}
		if(flash==1) {
			document.getElementById("helper").style.display="block";
		}
		document.getElementsByClassName("slider")[0].style.opacity=0;
		if(touch) {
			document.getElementById("spacebar").innerHTML="Click the <strong>(screen)</strong><br>to validate";
		} else {
			document.getElementById("spacebar").innerHTML="Hit <strong>(spacebar)</strong><br>to validate";					
		}
		document.getElementById("spacebar").style.opacity=0;
		document.getElementById("affiche").style.opacity=0;
	}
	function loadFontSettings() {
		//Get Font settings 
		document.getElementById("affiche").style.fontFamily=document.getElementsByClassName("textpar")[lvl].children[step].style.fontFamily;
		document.getElementById("affiche").style.fontVariationSettings=document.getElementsByClassName("textpar")[lvl].children[step].style.fontVariationSettings;
		document.getElementById("affiche").innerHTML=document.getElementsByClassName("textpar")[lvl].children[step].innerHTML;
		fout=searchFont(document.getElementsByClassName("textpar")[lvl].children[step].style.fontFamily);
		prm=[];
		fonttype=[];
		var fontvar= document.getElementsByClassName("textpar")[lvl].children[step].style.fontVariationSettings.split(", ")
		for(var i=0;i<fontvar.length;i++) {
			fontvar[i]=fontvar[i].split(" ");
		}
		for(var i=0;i<fontvar.length;i++) {
			fonttype.push(fontvar[i][0]);
			prm.push((fontvar[i][1]-fout[0][i])/(fout[1][i]-fout[0][i]));
		}
	}
			
	function startGame() {
		//Start Game
		document.getElementById("affiche").style.opacity=1;
		document.getElementsByClassName("slider")[0].style.marginLeft=0+"%";
		document.getElementsByClassName("slider")[0].style.opacity=1;
		document.getElementById("spacebar").style.opacity=1;
		if(touch) {
			document.getElementById("spacebar").innerHTML= "Click the <strong>(screen)</strong><br>to validate";
		} else {
			document.getElementById("spacebar").innerHTML= "Hit <strong>(spacebar)</strong><br>to validate";
		}
		k=false;
	}
	function moveGame(flash) {
		//Move Game
		r=Math.floor(t/200);
		sldr=-Math.cos(t/200*Math.PI)/2+.5;
		if(flash==0) {
			document.getElementById("affiche").style.fontWeight=10;
		} else {
			var fontvariation="";
			for(var i=0;i<fonttype.length;i++) {
				fontvariation+=fonttype[i]+" ";
				if(i<vari) {
					fontvariation+=fontscore[i]*(fout[1][i]-fout[0][i])+fout[0][i];
				} else if(i==vari) {
					fontvariation+=sldr*(fout[1][i]-fout[0][i])+fout[0][i];
				} else {
					fontvariation+=fout[0][i];
				}
				if(i!=fonttype.length-1) {
					fontvariation+=", ";
				}
			}
			document.getElementById("affiche").style.fontVariationSettings=fontvariation;
		}
		document.getElementsByClassName("slider")[0].style.marginLeft=sldr*100+"%";	
	}
	function saveScore() {
		//Save Score/Input Time
		fontscore.push(sldr);
		score[step].push(1-Math.abs(sldr-prm[vari]));//1-Math.abs(sldr-prm[0])
		penalty[step]+=r;
		k=false;
		if(vari==fonttype.length-1) {
			document.getElementsByClassName("textpar")[lvl].children[step].style.display="block";
		}
	}
	function resetAdvance() {
		//Reset & Advance Game
		document.getElementsByClassName("slider")[0].style.opacity=0.3;
		document.getElementById("affiche").style.opacity=0.3;
		document.getElementById("spacebar").style.opacity=0.3;
		document.getElementsByClassName("textpar")[lvl].children[step].style.display="none";
		step++;
		fontscore=[];
		vari=0;
		t=-200;
		document.getElementById("headerlevel").children[0].children[1].innerHTML=step+"/"+Math.max(1,Math.min(lvl,4));
	}
	function advanceVarType() {
		vari++;
		t=0;
	}
	function searchFont(fnt) {
		for(var i=0;i<font.length;i++) {
			if(fnt==font[i]) {
				return [fmin[i],fmax[i]];
			}
		}
	}
	function scoreboard(bounce) {
		if(bounce) {
			document.getElementById("score").children[0].children[1].children[2].style.display="block";
			document.getElementById("score").children[0].children[2].children[2].style.display="block";
		} else {
			document.getElementById("score").children[0].children[1].children[2].style.display="none";
			document.getElementById("score").children[0].children[2].children[2].style.display="none";
		}
		document.getElementById("headerlevel").style.display="none";
		document.getElementById("headerscore").style.display="flex";
		document.getElementById("score").style.display="flex";
		document.getElementById("game").style.filter= "blur(8px)";
		totalscore=0;
		for(var i=0;i<4;i++) {
			if(i<Math.max(1,Math.min(lvl,4))) {
				document.getElementById("score").children[0].children[2].children[0].children[i].style.display="block";
				document.getElementById("score").children[0].children[2].children[1].children[i].style.display="block";
				document.getElementById("score").children[0].children[2].children[2].children[i].style.display="block";
				document.getElementById("score").children[0].children[2].children[3].children[i].style.display="block";
			} else {
				document.getElementById("score").children[0].children[2].children[0].children[i].style.display="none";
				document.getElementById("score").children[0].children[2].children[1].children[i].style.display="none";
				document.getElementById("score").children[0].children[2].children[2].children[i].style.display="none";
				document.getElementById("score").children[0].children[2].children[3].children[i].style.display="none";
			}
		}
		for(var i=0;i<score.length;i++) {
			if(bounce==false) {
				penalty[i]=0;
			}
			var scorestep=0;
			for(var j=0;j<score[i].length;j++) {
				scorestep+=score[i][j];
			}
			scorestep=Math.ceil(scorestep/score[i].length*100);
			document.getElementById("scoreboard").children[1].children[i].innerHTML=scorestep+"%";
			document.getElementById("scoreboard").children[2].children[i].innerHTML=penalty[i];
			document.getElementById("scoreboard").children[3].children[i].innerHTML=Math.ceil(scorestep/(penalty[i]+1))+"%";
			totalscore+=Math.ceil(scorestep/(penalty[i]+1));
		}
		totalscore=Math.floor(totalscore/score.length);
		document.getElementById("scoreboard").parentElement.children[0].children[0].innerHTML=" Level "+lvl+" - <strong>"+totalscore+"%</strong>";
		//unlock Collection
		document.getElementsByClassName("elementmenu")[lvl].children[0].style.visibility="visible";
		document.getElementsByClassName("elementmenu")[lvl].children[0].innerHTML=Math.max(parseInt(document.getElementsByClassName("elementmenu")[lvl].children[0].innerHTML),totalscore)+"%";
		document.getElementsByClassName("elementmenu")[lvl].children[1].style.fontFamily=document.getElementsByClassName("textpar")[lvl].children[0].style.fontFamily;
		document.getElementsByClassName("elementmenu")[lvl+1].children[1].style.textDecoration="none";
		document.getElementsByClassName("elementmenu")[lvl].children[1].innerHTML=lvlname[lvl];
		document.getElementsByClassName("elementmenu")[lvl+1].children[1].innerHTML="Next";
	}
	function waitscore() {
		if(k===false) {
			page=mode;
			//Load Scoreboard
			scoreboard(lvl>3);
			waitinput=[" ","r","R","s","S","c","C"];
			clearInterval(id);
		} else {
			switch(k+"t") {
				case " t":
					lvl++;
					mode=0;
					break;
				case "Rt":
				case "rt":
					mode=0;
					break;
				case "Ct":
				case "ct":
					mode=5;
					break;
				case "St":
				case "st":
					mode=6;
					break;
			}
			document.getElementById("headerscore").style.display="none";
			document.getElementById("score").style.display="none";			
			k=false;
		}
	}
	function loadCollection() {
		if(k===false){
			document.getElementById("menu").style.display="flex";
			document.getElementById("headercollection").style.display="flex";
			waitinput=["s","S","c","C","1","2","3","4","5","6","7","8","9"]
			clearInterval(id);
		} else {
			document.getElementById("menu").style.display="none";
			document.getElementById("headercollection").style.display="none";
			if(k=="c" ||k=="C") {
				mode=page;
			} else if(k=="s" || k=="S") {
				mode=6;
			} else {
				if (document.getElementsByClassName("elementmenu")[parseInt(k)].children[1].innerHTML!="locked") {
					mode=0;
					lvl=parseInt(k);
				}
			}
			k=false;
		}
	}
	function loadSettings() {
		if(k===false) {
			document.getElementById("settings").style.display="flex";
			document.getElementById("headersettings").style.display="flex";
			waitinput=["c","C","s","S"];
			clearInterval(id);
		} else {
			document.getElementById("settings").style.display="none";
			document.getElementById("headersettings").style.display="none";
			if(k=="s" || k=="S") {
				mode=page;
			} else if(k=="c" ||k=="C") {
				mode=5;
			}
			k=false;
		}
	}
}
function Click() {
	keyPressed(" ");
}
function keyboard(event) {
	keyPressed(event.key);
}
function keyPressed(key) {
	if(key=="Escape") {
		clearInterval(id);
	} else if(waitinput!==false) {
		for(var i=0;i<waitinput.length;i++) {
			k=key;
			if(k===waitinput[i]) {
				id = setInterval(loop, 10);
				waitinput=false;
			}
		}
	} else {
		k=key;
	}
}
function touchScreen() {
	touch=true;
}
