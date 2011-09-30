# coding=utf-8
import subprocess,os,shlex,shutil,StringIO,os,re,base64,fileinput
from xml.dom import minidom
init_xml='<?xml version="1.0" encoding="UTF-8"?><softs><soft name="init_pyth(c)onfigurator"><msg>QmllbnZlbnVlIGRhbnMgcHl0aChjKW9uZmlndXJhdG9yDQppbml0aWFsaXNhdGlvbiBkdSBwcm9n\ncmFtbWUuLi4NCm1pc2Ug4CBqb3VyIGR1IHN5c3TobWUsIGNlbGEgcGV1dCBwcmVuZHJlIHBsdXNp\nZXVycyBtaW51dGVzLi4u</msg><cmd out="">YXB0LWdldCAteSB1cGRhdGUgJiYgYXB0LWdldCAteSB1cGdyYWRl</cmd><msg>Vm90cmUgc3lzdOhtZSBlc3Qg4CBqb3VyLi4u</msg></soft></softs>'
class soft_installer():
	
	xml=''
	executed=[]
	e=0
	installed=[]
	softs=[]
	std_out=open("stdout_soft_installer","w")
	error=[]
	install_var={}
	v=False
	log_str=''
	entry=[]
	
	def __init__(self):
		self.xml=minidom.parseString(init_xml)
		self.run()
		self.executed[:]=[]
		self.softs[:]=[]
		self.raw_entry()
		
	
	def log(self,s):
		self.log_str+=str(s)+'\n'
	
	def load(self,path):
		self.log('chargement de '+path+'\n')
		self.xml=minidom.parse(path)
	
	def logerror(self,s):
		self.log_str+='ERROR : '+str(s)+'\n'
		self.error.append(s)
		
	def verbose(self,msg):
		self.log(msg)
		if(self.v==True):
			print msg	
		
	def printlog(self,msg):
		self.log(msg)
		print str(msg)
	
	def logexecuted(self,s):
		self.log_str+='resultat :'+str(s)+'\n\n'
		self.executed.append(s)
		
	def lastexecuted(self):
		return self.executed[len(self.executed)-1]
		
	def raw_entry(self):
		self.entry.append(raw_input())
		entry=self.entry[len(self.entry)-1]		
		self.log('commande manuelle : '+entry+'\n')
		entry=self.parse_entry(entry)
		if(entry!=False):
			self.xml=entry
			self.run()
		self.raw_entry()
		
	def parse_entry(self,s):
		s=str(s)
		s=s.split(' ')
		tag=s[0]
		s.pop(0)
		xml_str='<softs><soft name=""><'+tag
		for arg in s:
			xml_str+=' '+arg
		if(tag=='verbose'):
			if(len(s)==0):
				print self.verbose
			elif(s[0]=='1'):
				self.verbose=True
			else:
				self.verbose=False
		elif(tag=='msg'):
			m=raw_input('Votre message :\n')
			n=''
		elif(tag=='cmd'):
			m=raw_input('Votre commande :\n')
			n=''
		elif(tag=='apt'):
			m=raw_input('logiciel a installer (vide si terminé) :\n')
			n=''
			while(m!=''):
				n+='<apt_soft name="'+str(m)+'"/>'
				m=raw_input('logiciel a installer (vide si terminé) :\n')
		elif(tag=='replace'):
			m=raw_input('chaine a cherché (vide si terminé) :\n')
			n=''
			while(m!=''):
				n+='<r old="'+base64.b64encode(str(m))+'" '
				m=raw_input('chaine de remplacement :\n')
				n+='new="'+base64.b64encode(str(m))+'"/>'
				m=raw_input('chaine a cherché (vide si terminé) :\n')
			m=''
		elif(tag=='load'):
			self.load(s[0])
			return False
		elif(tag=='run'):
			self.run()
			return False
		else:
			m=''
			n=''
		m='>'+base64.b64encode(m)+n
		xml_str+=m+'</'+tag+'></soft></softs>'
		x=minidom.parseString(xml_str)
		return x
	
	def parse_var(self,s):
		if(s==None):
			s=""
		else:
			i=s.find(':@:')
			while(i!=-1):
				var_s=i+3
				var_e=s.find(':/@:')
				s=s.replace(s[i:var_e+4],self.install_var[s[var_s:var_e]])
				i=s.find(':@:')
		return s
	
	def run(self):
		self.softs=self.xml.getElementsByTagName('soft')
		commande=[]
		n=self.xml.documentElement.getAttribute('name')
		if(n=='init_pyth(c)onfigurator'):
			self.printlog('\\__/>pyth(c)configurator by @DimitriGilbert<\\__/\n\n')
		elif(n==''):
			pass
#			self.printlog('entrée manuelle : '+str(self.xml.toxml())+'\n')
		else:
			self.printlog('Lancement du script d\'installation pour '+n+'\n')
		for s in self.softs:
			commande[:]=[]
			commande=s.childNodes
			for c in commande:
				self.exec_node(c)
		self.verbose(str(self.error))
		
	def raw(self,node):
		if(node.getAttribute('value')==""):
			msg=self.parse_var(node.getAttribute('ask'))
			var_name=self.parse_var(node.getAttribute('id'))
			raw=raw_input(msg+'\n')
			if(raw=="" and node.getAttribute('default')!=""):
				self.install_var[var_name]=node.getAttribute('default')
				self.verbose(':@:'+var_name+':/@:='+node.getAttribute('default'))
				return True
			elif(raw=="" and node.getAttribute('default')=="" and node.getAttribute('error')!=""):
				print node.getAttribute('error')
				self.verbose('valeur de :@:'+var_name+':/@: incorecte')
				return self.exec_node(node)
			
			self.install_var[var_name]=raw
			self.verbose(':@:'+var_name+':/@:='+raw)
			return True
		#todo traitement des autres attributs
		else:
			return True
				
	def apt(self,node):
		apts=node.childNodes
		sh_d=['apt-get','-y','install']
		self.verbose('installation des paquet suivant : \n')
		for a in apts:
			sh_d.append(self.parse_var(a.getAttribute('name')))
			self.verbose(a.getAttribute('name')+' ')
		
		if(node.getAttribute('out')=='0'):
			self.logexecuted(subprocess.call(sh_d))
		else:
			self.logexecuted(subprocess.call(sh_d,stdout=self.std_out))
		
		if(self.lastexecuted()==0):
			self.e+=1
			return True
		else:
			self.logerror('la commande apt suivante a echouée :\n'+str(sh_d))
			self.e+=1
			return False

	def apt_raw(self,node):
		apts=node.childNodes
		sh_d=['apt-get','-y','install']
		self.verbose('choix pour installation des paquets suivant : \n')
		for a in apts:
			if(raw_input(a.getAttribute('ask'))!=a.getAttribute('no')):
				sh_d.append(self.parse_var(a.getAttribute('name')))
				self.verbose(a.getAttribute('name')+' ')
				self.install_var[a.getAttribute('id')]=True
			else:
				self.install_var[a.getAttribute('id')]=False
		
		if(node.getAttribute('out')=='0'):
			self.logexecuted(subprocess.call(sh_d))
		else:
			self.logexecuted(subprocess.call(sh_d,stdout=self.std_out))
		
		if(self.lastexecuted()==0):
			self.e+=1
			return True
		else:
			self.logerror('la commande apt suivante a echouée :\n'+str(sh_d))
			self.e+=1
			return False
	
	def mdir(self,node):
		p=self.parse_var(node.getAttribute('path'))
		self.verbose('creation du dossier : '+p)
		os.makedirs(p)
		return True
	
	def mfile(self,node):
		p=self.parse_var(node.getAttribute('path'))
		self.verbose('creation du fichier : '+p)
		mod=self.parse_var(node.getAttribute('mode'))
		
		f=open(p,mod)
		if(node.getAttribute('content')!=""):
			f.write(self.parse_var(base64.b64decode(node.firstChild.data)))
		f.close()
		return True
	
	def msg(self,node):
		self.printlog(self.parse_var(base64.b64decode(node.firstChild.data))) 
		return True
		
	def rm(self,node):
		self.verbose('suppression de '+self.parse_var(node.getAttribute('path')))
		os.remove(self.parse_var(node.getAttribute('path')))
		return True
		
	def cp(self,node):
		if(node.getAttribute('type')=="file"):
			self.verbose('copie de '+self.parse_var(node.getAttribute('from'))+' vers '+self.parse_var(node.getAttribute('to')))
			shutil.copyfile(self.parse_var(node.getAttribute('from')),self.parse_var(node.getAttribute('to')))
		elif(node.getAttribute('type')=="dir"):
			return False
		else:
			self.logerror('type de copie incorrect '+node.getAttribute('type'))
			return False
		return True
		
	def cmd(self,node):
		self.verbose('execution shell de '+self.parse_var(base64.b64decode(node.firstChild.data)))
		if(node.getAttribute('out')=='0'):
			self.logexecuted(subprocess.call(self.parse_var(base64.b64decode(node.firstChild.data)),shell=True))
		else:
			self.logexecuted(subprocess.call(self.parse_var(base64.b64decode(node.firstChild.data)),shell=True,stdout=self.std_out))
		if(self.lastexecuted()==0):
			return True
		else:
			self.logerror('la commande suivante a echouée :\n'+self.parse_var(base64.b64decode(node.firstChild.data)))
			return False
		
	def file_replace(self,node):
		p=self.parse_var(node.getAttribute('path'))
		replaces=node.childNodes
		for line in fileinput.input(p,inplace=1):
			for r in replaces:
				line=line.replace(base64.b64decode(r.getAttribute('old')),base64.b64decode(r.getAttribute('new')))
			print line
		return True
	
	def exec_node(self,node):
		tag=node.tagName
		if(tag=='raw'):
			return self.raw(node)
		
		elif(tag=='apt'):
			return self.apt(node)
		
		elif(tag=='apt_raw'):
			return self.apt_raw(node)		
		
		elif(tag=='dir'):
			return self.mdir(node)	
		
		elif(tag=='file'):
			return self.mfile(node)
		
		elif(tag=='msg'):
			return self.msg(node)
		
		elif(tag=='rm'):
			return self.rm(node)
		
		elif(tag=='cp'):
			return self.cp(node)
		
		elif(tag=='cmd'):
			return self.cmd(node)
		
		elif(tag=='replace'):
			return self.file_replace(node)
		
		else:
			self.logerror('le tag : '+tag+' est inconnus')
			return False
			

#inpt=raw_input('chemin du fichier xml ?\n')		
test=soft_installer()
#test.load(inpt)
##test.v=True
#test.run()
