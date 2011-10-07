var JSI=function()
{
	var t=this;
	/*
	creation d'elements html
	*/
	this.element=function(type,att_name,att_value,value)
	{
		var elt=document.createElement(type);
		var x=0;
		var y=att_name.length;
		if(att_name)
		{
			while(x<y)
			{
				elt.setAttribute(att_name[x],att_value[x]);
				x++;
			}
			if(value)
			{
				elt.innerHTML=value;
			}
		}
	
		return elt;
	}
	
	this.a=function(att_name,att_value,href,value,blank)
	{
		att_name.push('href');
		att_value.push(href);
		if(blank)
		{
			att_name.push('target');
			att_value.push('_blank');
		}
		return t.element('a',att_name,att_value,value);
	}
	
	this.div=function(att_name,att_value,value)
	{
		return t.element('div',att_name,att_value,value);
	}
	
	this.img=function(src,att_name,att_value)
	{
		att_name.push('src');
		att_value.push(src);
		var value;
		return t.element('img',att_name,att_value,value);
	}
	
	this.h2=function(att_name,att_value,value)
	{
		return t.element('h2',att_name,att_value,value);
	}
	
	this.span=function(att_name,att_value,value)
	{
		return t.element('span',att_name,att_value,value);
	}
	
	this.select=function(o_val,o_inner,att_name,att_value)
	{
		var sel=t.element('select',att_name,att_value);
		var x=0;
		var y=o_val.length;
	
		while(x<y)
		{
			var opt=t.element('option',['value'],[o_val[x]],o_inner[x]);
			sel.appendChild(opt);
			x++;
		}
	
		return sel;
	}
	
	this.clear=function(side)
	{
		if(!side)
		{
			var side='both';
		}
		return t.element('div',['style'],['clear:'+side+';']);
	}
	
	this.text=function(att_name,att_value,value)
	{
		att_name.push('type');
		att_value.push('text');
		if(value)
		{
			att_name.push('value');
			att_value.push(value);
		}
		return t.element('input',att_name,att_value);
	}
	
	this.password=function(att_name,att_value,value)
	{
		att_name.push('type');
		att_value.push('password');
		if(value)
		{
			att_name.push('value');
			att_value.push(value);
		}
		return t.element('input',att_name,att_value);
	}
	
	this.button=function(att_name,att_value,value)
	{
		att_name.push('type');
		att_value.push('button');
		if(value)
		{
			att_name.push('value');
			att_value.push(value);
		}
		return t.element('input',att_name,att_value);
	}
	
	this.label=function(i_id,content)
	{
		return t.element('label',['for','id','class'],[i_id,i_id+'_label','label_form'],content);
	}
	
	this.input4form=function(i_id,label_cont,att_name,att_value,value,cont_class,eg)
	{
		if(!cont_class)
		{
			var cont_class="";
		}
		var div=t.div(['class'],[cont_class]);
		div.appendChild(t.label(i_id,label_cont+' : '));
		att_name.push('id');
		att_value.push(i_id);
		div.appendChild(t.text(att_name,att_value,value));
		if(eg)
		{
			div.appendChild(t.div(['class'],['eg'],'exemple : '+eg));
		}
		return div;
	}
	
	this.vInput4form=function(i_id,label_cont,att_name,att_value,value,cont_class,eg)
	{
		if(!cont_class)
		{
			var cont_class="";
		}
		var div=t.div(['class'],[cont_class]);
		div.appendChild(t.label(i_id,label_cont+'* : '));
		att_name.push('id');
		att_value.push(i_id);
		div.appendChild(t.not_empty(t.text(att_name,att_value,value)));
		if(eg)
		{
			div.appendChild(t.div(['class'],['eg'],'exemple : '+eg));
		}
		return div;
	}
	
	this.pass4form=function(i_id,label_cont,att_name,att_value,value,cont_class)
	{
		if(!cont_class)
		{
			var cont_class="";
		}
		var div=t.div(['class'],[cont_class]);
		div.appendChild(t.label(i_id,label_cont+'* : '));
		att_name.push('id');
		att_value.push(i_id);
		div.appendChild(t.password(att_name,att_value,value));
		return div;
	}
	
	this.tArea4form=function(i_id,label_cont,att_name,att_value,value,cont_class)
	{
		if(!cont_class)
		{
			var cont_class="";
		}
		var div=t.div(['class'],[cont_class]);
		div.appendChild(t.label(i_id,label_cont+' : '));
		att_name.push('id');
		att_value.push(i_id);
		div.appendChild(t.tArea(att_name,att_value,value));
		return div;
	}
	
	this.checkbox=function(i_id,label_cont,atts_name,atts_value,values,cont_class)
	{		
		if(!cont_class)
		{
			var cont_class="";
		}
		var div=t.div(['class'],[cont_class]);
		div.appendChild(t.label(i_id,label_cont));
		for(x in atts_name)
		{
			var div2=t.div(['class'],[''],values[x]);
			var at_n=atts_name[x];
			var at_v=atts_value[x];
			at_v.push('checkbox');
			at_n.push('type');
			at_v.push(i_id+'_'+values[x]);
			at_n.push('id');
			div2.appendChild(t.element('input',at_n,at_v));
			div.appendChild(div2);
		}
		
		return div;
	}
	
	this.radio=function(i_id,label_cont,atts_name,atts_value,values,cont_class)
	{		
		if(!cont_class)
		{
			var cont_class="";
		}
		var div=t.div(['class'],[cont_class]);
		div.appendChild(t.label(i_id,label_cont));
		for(x in atts_name)
		{
			var div2=t.div(['class'],['radio'],values[x]);
			var at_n=atts_name[x];
			var at_v=atts_value[x];
			at_v.push('radio');
			at_n.push('type');
			at_v.push(i_id+'_'+values[x]);
			at_n.push('id');
			at_v.push(i_id);
			at_n.push('name');
			div2.appendChild(t.element('input',at_n,at_v));
			div.appendChild(div2);
		}
		
		return div;
	}
	
	this.tArea=function(att_name,att_value,value)
	{
		var tarea=t.element('textarea',att_name,att_value);
		if(value)
		{
			tarea.innerHTML=value;
		}
		return tarea;
	}
	
	this.iframe=function(att_name,att_value,url)
	{
		att_name.push('src');
		att_value.push(url);
		return t.element('iframe',att_name,att_value)
	}
	
	this.script=function(src,value)
	{
		if(src=='')
		{
			return t.element('script',['type'],['text/javascript'],value);
		}
		else
		{
			return t.element('script',['src','type'],[src,'text/javascript'],value);
		}
		
	}
	
	
	
	/*
	manipulation d'elements html
	*/
	this.insert=function(childs,node)
	{
		var x=0;
		var y=childs.length;
		while(x<y)
		{
			node.appendChild(childs[x]);
			x++;
		}
		return node;
	}
	
	this.display=function(type,elts)
	{
		var x=0;
		var y=elts.length;
		while(x<y)
		{
			document.getElementById(elts[x]).style.display=type;
			x++;
		}
	}
	
	this.block=function(elts)
	{
		t.display('block',elts);
	}
	
	this.displayNone=function(elts)
	{
		t.display('none',elts);
	}
	
	this.add2Attribute=function(elts,att,val)
	{
		if(elts.hasAttribute(att))
		{
			val=elts.getAttribute(att)+';'+val;
		}
		
		elts.setAttribute(att,val);
		return elts;
	}
	
	this.upload=function(id,url,content)
	{
		if(!content)
		{
			var content='Fichier : ';
		}
		var form=t.element('form',['id','action','method','enctype','target'],[id+'_form',url,'post','multipart/form-data',id+'_up_target'],content);
		form.appendChild(t.element('input',['type','name','id'],['file',id+'_file',id+'_file']));
		form.appendChild(t.element('input',['type','value'],['submit','Envoyer']));
		
		var div=t.div(['id'],[id]);
		div.appendChild(form);
		div.appendChild(t.iframe(['id','name','style'],[id+'_up_target',id+'_up_target','width:0px;height:0px;border:0px solid #fff;'],'#'));
		return div;
	}
	
	/*
	manipulation de input
	*/
	this.not_empty=function(input,def)
	{
		var fn='if(this.value==""';
		if(!def)
		{
			fn+=')';
		}
		else
		{
			fn+=' || this.value=="'+def+'")';
		}		
		fn+='{this.style.background="#FAA0B6";}else{this.style.background="#FFF";}';
		
		return t.add2Attribute(input,'onblur',fn);
	}
	
	this.same_value_as=function(input1,input2_id)
	{
		var fn='if(this.value!=document.getElementById("'+input2_id+'").value){this.style.background="#FAA0B6";}else{this.style.background="#5FFA5A";}';
		
		return t.add2Attribute(input1,'onkeyup',fn);
	}
	
	this.is_strong=function(str)
	{
		var strength=0;
		if(str.length>9)
		{
			strength++;
		}
		if((str.match(/[a-z]/)) && (str.match(/[A-Z]/)))
		{
			strength++;
		}
		if(str.match(/\d+/))
		{
			strength++;
		}
		if(str.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))
		{
			strength++;
		}
		if(str.length>=6)
		{
			strength++;
		}
		else
		{
			strength=0;
		}
		return strength
	}
	
	this.strong_enough=function(pass)
	{
		var str=t.is_strong(new String(pass.value));
		switch(str)
		{
			case 0:
				pass.style.background="#FAA0B6";
				break;			
			case 1:
				pass.style.background="#FAA0B6";
				break;
			case 2:
				pass.style.background="#FACA5A";
				break;
			case 3:
				pass.style.background="#B2FA5A";
				break;
			case 4:
				pass.style.background="#5FFA5A";
				break;
		}
		return pass;
	}
	
	this.strength_checker=function(input)
	{
		var fn='jsi.strong_enough(this)';
		return t.add2Attribute(input,'onkeyup',fn);
	}
	
	this.is_mail=function(input)
	{
		var str=new String(input.value)
		var e_reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		if(str.search(e_reg)==-1)
		{
			input.style.background="#FAA0B6";
		}
		else
		{
			input.style.background="#5FFA5A";
		}
		return input;
	}
	
	this.mail_checker=function(input)
	{
		var fn='jsi.is_mail(this)';
		return t.add2Attribute(input,'onblur',fn);
	}
}













