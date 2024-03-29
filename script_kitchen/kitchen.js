//http://www.webtoolkit.info/javascript-base64.html
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
}

//xml vide pour nouvel objet xml
var new_xml_str='<?xml version="1.0" encoding="UTF-8"?><soft></soft>';

//initialisation de jsinterface
var jsi=new JSI;

//creation d'id aleatoire
var gen_id=function() 
{
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');    
    len=12;    
    var str = '';
    for (var i = 0; i < len; i++)
    {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

var xml2str=function(xml)
{
	if (window.ActiveXObject) 
	{
		return xml.xml;
	}
	else
	{
		return (new XMLSerializer()).serializeToString(xml);
	}
}

//raccourci pour document.getElementById
var docelid=function(id)
{
	return document.getElementById(id);
}

var new_script=function()
{
	docelid('content_out').style.display="none";
	docelid('content_load_script').style.display="none";
	docelid('content_new_script').style.display="block";
}

var load_script=function()
{
	docelid('content_out').style.display="none";	
	docelid('content_new_script').style.display="none";
	docelid('content_load_script').style.display="block";
}

//main classe 
var Kitchen=function()
{
	//creation d'un nouvel objet xml
	this.init_xml=function()
	{
		if (window.DOMParser)
		{
			this.k_xml=new DOMParser().parseFromString(new_xml_str,"text/xml");
		}
		else
		{
			this.k_xml=new ActiveXObject("Microsoft.XMLDOM");
			k_xml.async="false";
			k_xml.loadXML(new_xml_str);
		}
	}
	
	
	this.script_detail=docelid('new_script_detail');
	this.init_xml();
	
	//methodes de creation des differents formulaire pour la creation de noeud
	this.new_raw=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node raw','raw_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"RAW_INPUT"));
		//id, utiliser comme index pour install_var[]
		div.appendChild(jsi.input4form(id+'_id',"Nom de la variable dans install_var",[],[],''));
		//ask
		div.appendChild(jsi.input4form(id+'_ask',"Question du raw_input",[],[],''));
		//error
		div.appendChild(jsi.input4form(id+'_error',"Message d'erreur, laissez vide si inutile",[],[],''));
		//expect
		div.appendChild(jsi.input4form(id+'_expect',"expression reguliere pour verification, laissez vide si inutile",[],[],''));
		//default
		div.appendChild(jsi.input4form(id+'_default',"Valeur par defaut du raw_input",[],[],''));
		
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
		
	}
	this.new_download=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node download','dl_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"DOWNLOAD"));
		//url
		div.appendChild(jsi.input4form(id+'_url',"URL du fichier à télécharger",[],[],''));
		//chemin du fichier telecharger
		div.appendChild(jsi.input4form(id+'_file_path',"Chemin du fichier téléchargé en local",[],[],''));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_apt=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node apt','apt_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"APT"));
		//out
		div.appendChild(jsi.input4form(id+'_out',"Rediriger la sortie standart (oui si vide, non si remplis)",[],[],''));
		//nombre de soft a installer
		div.appendChild(jsi.input4form(id+'_nb_soft',"Nombre de softs à installer",['onkeyup'],['kitchen.add_apt_soft(this.value,"'+id+'")'],''));
		//div pour insere les input pour les softs
		div.appendChild(jsi.div(['class','id'],['apt_soft',id+'_apt_soft']));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
		
	}
	this.new_apt_raw=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node apt_raw','apt-raw_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"APT_RAW"));
		//out
		div.appendChild(jsi.input4form(id+'_out',"Rediriger la sortie standart (oui si vide, non si remplis)",[],[],''));
		//nombre de soft a installer
		div.appendChild(jsi.input4form(id+'_nb_soft',"Nombre de softs à installer",['onkeyup'],['kitchen.add_apt_raw_soft(this.value,"'+id+'")'],''));
		//valeur su yes
		div.appendChild(jsi.input4form(id+'_yes',"Valeur de validation",[],[],'y'));
		//valeur su no
		div.appendChild(jsi.input4form(id+'_no',"Valeur de refus",[],[],'n'));
		//div pour insere les input pour les softs
		div.appendChild(jsi.div(['class','id'],['apt_soft',id+'_apt_raw_soft']));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_replace=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node replace','replace_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"REPLACE"));
		//path
		div.appendChild(jsi.input4form(id+'_path',"Chemin du fichier ou remplacer",[],[],''));
		//nombre de chaine a rechercher
		div.appendChild(jsi.input4form(id+'_nb_replace',"Nombre de chaine à remplacer",['onkeyup'],['kitchen.add_replace_r(this.value,"'+id+'")'],''));
		//div pour insere les input pour les r
		div.appendChild(jsi.div(['class','id'],['replace_r',id+'_replace_r']));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
		
	}
	this.new_dir=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node dir','dir_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"DIR"));
		//path
		div.appendChild(jsi.input4form(id+'_path',"Chemin du dossier à créer",[],[],''));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_file=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node file','file_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"FILE"));
		//path
		div.appendChild(jsi.input4form(id+'_path',"Chemin du fichier à créer",[],[],''));
		//mode
		div.appendChild(jsi.input4form(id+'_mode',"Mode d'ouverture du fichier à créer",[],[],'w'));
		//contenu du fichier
		div.appendChild(jsi.tArea4form(id+'_content','Contenu du fichier, laisser vide si aucun',[],[],''));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_cmd=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node cmd','cmd_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"CMD"));
		//out
		div.appendChild(jsi.input4form(id+'_out',"Rediriger la sortie standart (oui si vide, non si remplis)",[],[],''));
		//commande shell
		div.appendChild(jsi.tArea4form(id+'_cmd','Commande shell',[],[],''));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_rm=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node rm','rm_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"RM"));
		//path
		div.appendChild(jsi.input4form(id+'_path',"Chemin à supprimez",[],[],''));
		//type
		div.appendChild(jsi.input4form(id+'_type',"file ou dir",[],[],'file'));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_cp=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node cp','cp_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"CP"));
		//from
		div.appendChild(jsi.input4form(id+'_from',"Chemin à copier",[],[],''));
		//to
		div.appendChild(jsi.input4form(id+'_to',"Chemin de destination",[],[],''));
		//type
		div.appendChild(jsi.input4form(id+'_type',"file ou dir",[],[],'file'));
		//r
		div.appendChild(jsi.input4form(id+'_r',"recursif (si dir seulement)",[],[],'1'));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_msg=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node msg','msg_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"MSG"));
		//contenu du message
		div.appendChild(jsi.tArea4form(id+'_content','Contenu du message',[],[],''));
//		insertion du form dans la page
		return t.script_detail.appendChild(div);
	}
	this.new_soft=function()
	{
		var t=this;
		var id=gen_id();
		var div=jsi.div(['class','id'],['node soft','raw_'+id]);
		div.appendChild(jsi.div(['class'],['node_title'],"RAW_INPUT"));
	}
	
	//utilisation de la bonne methode au clique
	this.new_w=function(what)
	{
		var t=this;
		
		switch(what)
		{		
			case 'new_raw':
				t.new_raw();
				break;
			case 'new_download':
				t.new_download();
				break;
			case 'new_apt':
				t.new_apt();
				break;
			case 'new_apt_raw':
				t.new_apt_raw();
				break;
			case 'new_replace':
				t.new_replace();
				break;
			case 'new_dir':
				t.new_dir();
				break;
			case 'new_file':
				t.new_file();
				break;
			case 'new_cmd':
				t.new_cmd();
				break;
			case 'new_rm':
				t.new_rm();
				break;
			case 'new_cp':
				t.new_cp();
				break;
			case 'new_msg':
				t.new_msg();
				break;
			case 'new_soft':
				t.new_raw();
				break;
		}
	}
	
	this.add_replace_r=function(nb,id)
	{
		var x=0;
		var div='';
		var conteneur=docelid(id+'_replace_r');
		conteneur.innerHTML="";
		while(x<nb)
		{
			div=jsi.div([],[],'remplacement '+x);
			div.appendChild(jsi.input4form(id+'_replace_r_old_'+x,'old',[],[],'',''));
			div.appendChild(jsi.input4form(id+'_replace_r_new_'+x,'new',[],[],'',''));
			conteneur.appendChild(div);
			x++;
		}		
	}
	
	this.add_apt_soft=function(nb,id)
	{
		var x=0;
		var div='';
		var conteneur=docelid(id+'_apt_soft');
		conteneur.innerHTML="";
		while(x<nb)
		{
			div=jsi.div([],[],'Soft '+x);
			div.appendChild(jsi.input4form(id+'_apt_soft_'+x,'nom',[],[],'',''));
			conteneur.appendChild(div);
			x++;
		}		
	}
	
	this.add_apt_raw_soft=function(nb,id)
	{
		var x=0;
		var div='';
		var conteneur=docelid(id+'_apt_raw_soft');
		conteneur.innerHTML="";
		while(x<nb)
		{
			div=jsi.div([],[],'Soft '+x);
			div.appendChild(jsi.input4form(id+'_apt_raw_soft_nom_'+x,'nom',[],[],'',''));
			div.appendChild(jsi.input4form(id+'_apt_raw_soft_id_'+x,'id',[],[],'',''));
			div.appendChild(jsi.input4form(id+'_apt_raw_soft_ask_'+x,'question',[],[],'',''));
			conteneur.appendChild(div);
			x++;
		}		
	}
	
	//extracttion de l'identifiant du block
	this.get_block_id=function(str)
	{
		return str.split('_')[1];
	}
	
	//creation des noeud de commande
	this.create_raw=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		
		var raw=t.k_xml.createElement('raw');
		raw.setAttribute('id',docelid(id+'_id').value);
		raw.setAttribute('ask',docelid(id+'_ask').value);
		raw.setAttribute('error',docelid(id+'_error').value);
		raw.setAttribute('default',docelid(id+'_default').value);
		raw.setAttribute('expect',docelid(id+'_expect').value);
		raw.setAttribute('value',"");
		
		return raw;
		
	}
	this.create_download=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		
		var dl=t.k_xml.createElement('download');
		dl.setAttribute('fil_path',docelid(id+'_file_path').value);
		dl.textContent=Base64.encode(docelid(id+'_url').value);
		
		return dl;
	}
	this.create_apt=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		
		var a=t.k_xml.createElement('apt');
		var x=0;
		var nb=docelid(id+'_nb_soft').value;
		
		var o=docelid(id+'_out').value;
		if(o=='')
		{
			a.setAttribute('out','1');
		}
		else
		{
			a.setAttribute('out','0');
		}
		
		var as='';
		while(x<nb)
		{
			as=t.k_xml.createElement('apt_soft');
			as.setAttribute('name',docelid(id+'_apt_soft_'+x).value);
			a.appendChild(as);
			x++;
		}
		
		return a;
	}
	this.create_apt_raw=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		var a=t.k_xml.createElement('apt_raw');
		var x=0;
		var nb=docelid(id+'_nb_soft').value;
		
		var o=docelid(id+'_out').value;
		if(o=='')
		{
			a.setAttribute('out','1');
		}
		else
		{
			a.setAttribute('out','0');
		}
		a.setAttribute('default','y');
		a.setAttribute('yes',docelid(id+'_yes').value);
		a.setAttribute('no',docelid(id+'_no').value);
		
		var as='';
		while(x<nb)
		{
			as=t.k_xml.createElement('apt_raw_soft');
			as.setAttribute('name',docelid(id+'_apt_raw_soft_nom_'+x).value);
			as.setAttribute('id',docelid(id+'_apt_raw_soft_id_'+x).value);
			as.setAttribute('ask',docelid(id+'_apt_raw_soft_ask_'+x).value);
			as.setAttribute('value','');
			a.appendChild(as);
			x++;
		}
		
		return a;
	}
	this.create_replace=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		var a=t.k_xml.createElement('replace');
		var x=0;
		var nb=docelid(id+'_nb_replace').value;
		
		var as='';
		while(x<nb)
		{
			as=t.k_xml.createElement('r');
			as.setAttribute('old',Base64.encode(docelid(id+'_replace_r_old_'+x).value));
			as.setAttribute('new',Base64.encode(docelid(id+'_replace_r_new_'+x).value));
			a.appendChild(as);
			x++;
		}
		
		return a;
	}
	this.create_dir=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		
		var dir=t.k_xml.createElement('dir');
		dir.setAttribute('path',docelid(id+'_path').value);
		
		return dir;
	}
	this.create_file=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		
		var f=t.k_xml.createElement('file');
		f.setAttribute('path',docelid(id+'_path').value);
		f.setAttribute('mode',docelid(id+'_mode').value);
		c=docelid(id+'_content').value;
		if(c!="")
		{
			f.setAttribute('content',1);
			f.textContent=Base64.encode(c);
		}
		else
		{
			f.setAttribute('content','');
		}
		
		return f;
	}
	this.create_cmd=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		var c=t.k_xml.createElement('cmd');
		var o=docelid(id+'_out').value;
		if(o=='')
		{
			c.setAttribute('out','1');
		}
		else
		{
			c.setAttribute('out','0');
		}
		c.textContent=Base64.encode(docelid(id+'_cmd').value);
		
		return c;		
	}
	this.create_rm=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		var r=t.k_xml.createElement('rm');
		r.setAttribute('path',docelid(id+'_path').value);
		r.setAttribute('type',docelid(id+'_type').value);
		
		return r;
	}
	this.create_cp=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		var cp=t.k_xml.createElement('rm');
		cp.setAttribute('from',docelid(id+'_from').value);
		cp.setAttribute('to',docelid(id+'_to').value);
		var r=docelid(id+'_r').value;
		if(r=='')
		{
			cp.setAttribute('r','1');
		}
		else		
		{
			cp.setAttribute('r','0');
		}
		cp.setAttribute('type',docelid(id+'_type').value);
		
		return cp;
	}
	this.create_msg=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
		
		var m=t.k_xml.createElement('msg');
		m.textContent=Base64.encode(docelid(id+'_content').value)
		
		return m;
	}
	this.create_soft=function(div)
	{
		var t=this;
		var id=t.get_block_id(div.id);
	}
	
	
	//creation du XML global
	this.create_xml=function()
	{
		var t=this;
		t.init_xml();
		var xml=t.k_xml.documentElement;
		var nodes=t.script_detail.childNodes;
		var x=0;
		var y=nodes.length;
		while(nodes.item(x))
		{
			switch(nodes[x].classList[1])
			{		
				case 'raw':
					xml.appendChild(t.create_raw(nodes[x]));
					break;
				case 'download':
					xml.appendChild(t.create_download(nodes[x]));
					break;
				case 'apt':
					xml.appendChild(t.create_apt(nodes[x]));
					break;
				case 'apt_raw':
					xml.appendChild(t.create_apt_raw(nodes[x]));
					break;
				case 'replace':
					xml.appendChild(t.create_replace(nodes[x]));
					break;
				case 'dir':
					xml.appendChild(t.create_dir(nodes[x]));
					break;
				case 'file':
					xml.appendChild(t.create_file(nodes[x]));
					break;
				case 'cmd':
					xml.appendChild(t.create_cmd(nodes[x]));
					break;
				case 'rm':
					xml.appendChild(t.create_rm(nodes[x]));
					break;
				case 'cp':
					xml.appendChild(t.create_cp(nodes[x]));
					break;
				case 'msg':
					xml.appendChild(t.create_msg(nodes[x]));
					break;
				case 'soft':
					xml.appendChild(t.create_raw(nodes[x]));
					break;
			}
			x++;
		}
		docelid('xml_out_area').value=xml2str(xml);
		docelid('content_new_script').style.display='none';
		docelid('content_load_script').style.display='none';
		docelid('content_out').style.display='block';		
	}
	
	this.load_xml=function(xml_str)
	{
		var t=this;
		if (window.DOMParser)
		{
			t.k_xml=new DOMParser().parseFromString(xml_str,"text/xml");
		}
		else
		{
			t.k_xml=new ActiveXObject("Microsoft.XMLDOM");
			t.k_xml.async="false";
			t.k_xml.loadXML(xml_str);
		}
		
		var nodes=t.k_xml.documentElement.childNodes;
		var x=0;
		var y=nodes.length;
		var id='';
		while(x<y)
		{
			switch(nodes[x].nodeName)
			{		
				case 'raw':
					n=t.new_raw();
					id=t.get_block_id(n.id);
					docelid(id+'_id').value=nodes[x].getAttribute('id');
					docelid(id+'_default').value=nodes[x].getAttribute('default');
					docelid(id+'_expect').value=nodes[x].getAttribute('expect');
					docelid(id+'_error').value=nodes[x].getAttribute('error');
					docelid(id+'_ask').value=nodes[x].getAttribute('ask');
					break;
				case 'download':
					n=t.new_download();
					id=t.get_block_id(n.id);					
					docelid(id+'_path').value=nodes[x].getAttribute('path');				
					docelid(id+'_url').value=Base64.decode(nodes[x].textContent);
					break;
				case 'apt':
					n=t.new_apt();
					id=t.get_block_id(n.id);
					var a_softs=nodes[x].childNodes;
					docelid(id+'_out').value=nodes[x].getAttribute('out');
					var z=a_softs.length;
					var mz=0;
					docelid(id+'_nb_soft').value=z;
					t.add_apt_soft(z,id);
					while(mz<z)
					{
						docelid(id+'_apt_soft_'+mz).value=a_softs[mz].getAttribute('name');
						mz++;
					}
					break;
				case 'apt_raw':
					n=t.new_apt_raw();
					id=t.get_block_id(n.id);
					var a_softs=nodes[x].childNodes;
					docelid(id+'_out').value=nodes[x].getAttribute('out');
					docelid(id+'_no').value=nodes[x].getAttribute('no');
					docelid(id+'_yes').value=nodes[x].getAttribute('yes');
//					docelid(id+'_default').value=nodes[x].getAttribute('default');
					var z=a_softs.length;
					var mz=0;
					docelid(id+'_nb_soft').value=z;
					t.add_apt_raw_soft(z,id);
					while(mz<z)
					{
						docelid(id+'_apt_raw_soft_nom_'+mz).value=a_softs[mz].getAttribute('name');
						docelid(id+'_apt_raw_soft_ask_'+mz).value=a_softs[mz].getAttribute('ask');
						docelid(id+'_apt_raw_soft_id_'+mz).value=a_softs[mz].getAttribute('id');
						mz++;
					}
					break;
				case 'replace':
					n=t.new_replace();
					id=t.get_block_id(n.id);
					docelid(id+'_path').value=nodes[x].getAttribute('path');
					var rep=nodes[x].childNodes;
					var mz=0;
					var z=rep.length;
					docelid(id+'_nb_replace').value=z;
					t.add_replace_r(z,id);
					while(mz<z)
					{
						docelid(id+'_replace_r_old_'+mz).value=Base64.decode(rep[mz].getAttribute('old'));
						docelid(id+'_replace_r_new_'+mz).value=Base64.decode(rep[mz].getAttribute('new'));
						mz++;
					}
					break;
				case 'dir':
					n=t.new_dir();
					id=t.get_block_id(n.id);					
					docelid(id+'_path').value=nodes[x].getAttribute('path');
					break;
				case 'file':
					n=t.new_file();
					id=t.get_block_id(n.id);
					docelid(id+'_content').value=Base64.decode(nodes[x].textContent);					
					docelid(id+'_path').value=nodes[x].getAttribute('path');
					break;
				case 'cmd':
					n=t.new_cmd();
					id=t.get_block_id(n.id);
					docelid(id+'_cmd').value=Base64.decode(nodes[x].textContent);					
					docelid(id+'_out').value=nodes[x].getAttribute('out');
					break;
				case 'rm':
					n=t.new_rm();
					id=t.get_block_id(n.id);					
					docelid(id+'_path').value=nodes[x].getAttribute('path');					
					docelid(id+'_type').value=nodes[x].getAttribute('type');
					break;
				case 'cp':
					n=t.new_cp();
					id=t.get_block_id(n.id);					
					docelid(id+'_from').value=nodes[x].getAttribute('from');					
					docelid(id+'_to').value=nodes[x].getAttribute('to');					
					docelid(id+'_type').value=nodes[x].getAttribute('type');
					break;
				case 'msg':
					n=t.new_msg();
					id=t.get_block_id(n.id);
					docelid(id+'_content').value=Base64.decode(nodes[x].textContent);
					break;
				case 'soft':
//					n=t.new_soft();
//					id=t.get_block_id(n.id);
					break;
			}
			x++;
		}
		new_script();
	}
}

var kitchen=new Kitchen;




















