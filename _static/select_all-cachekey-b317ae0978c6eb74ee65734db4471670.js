
/* Merged Plone Javascript file
 * This file is dynamically assembled from separate parts.
 * Some of these parts have 3rd party licenses or copyright information attached
 * Such information is valid for that section,
 * not for the entire composite file
 * originating files are separated by - filename.js -
 */

/* - select_all.js - */
// http://plone.org/portal_javascripts/select_all.js?original=1
function toggleSelect(selectbutton,id,initialState,formName){if (/MSIE [5-8]\./.test(navigator.userAgent)&&event.type==="change"&&/toggleSelect\(/.test(selectbutton.onchange.toString())){return}
var fid,state,base;fid=id||'ids:list';state=selectbutton.isSelected;if(state===undefined){state=Boolean(initialState)}
selectbutton.isSelected=!state;jQuery(selectbutton).attr('src',portal_url+'/select_'+(state?'all':'none')+'_icon.png');base=formName?jQuery(document.forms[formName]):jQuery(document);base.find('input[name="'+fid+'"]:checkbox').attr('checked',!state)}


/* - dragdropreorder.js - */
// http://plone.org/portal_javascripts/dragdropreorder.js?original=1
var ploneDnDReorder={};ploneDnDReorder.dragging=null;ploneDnDReorder.table=null;ploneDnDReorder.rows=null;ploneDnDReorder.locked=false;(function($){ploneDnDReorder.doDown=function(e){var dragging=ploneDnDReorder.dragging,body;if(ploneDnDReorder.locked){return}
if(dragging){if($(this).attr('id')!==dragging.attr('id')){ploneDnDReorder.locked=true;dragging.removeClass('dragging').addClass('error')}
return}
dragging=$(this).parents('.draggable:first');if(!dragging.length){return}
ploneDnDReorder.rows.mousemove(ploneDnDReorder.doDrag);body=$('body');body.mouseup(ploneDnDReorder.doUp);body.mouseleave(ploneDnDReorder.doCancel);ploneDnDReorder.dragging=dragging;dragging.data('ploneDnDReorder.startPosition',ploneDnDReorder.getPos(dragging));dragging.addClass("dragging");$(this).parents('tr').addClass('dragindicator');dragging.data('ploneDnDReorder.subset_ids',$.map(ploneDnDReorder.table.find('tr.draggable'),
function(elem){return $(elem).attr('id').substr('folder-contents-item-'.length)}));return false};ploneDnDReorder.getPos=function(node){var pos=node.parent().children('.draggable').index(node[0]);return pos===-1?null:pos};ploneDnDReorder.doDrag=function(e){var dragging=ploneDnDReorder.dragging,target=this;if(!dragging){return}
if(!target){return}
if($(target).attr('id')!==dragging.attr('id')){ploneDnDReorder.swapElements($(target),dragging)}
return false};ploneDnDReorder.swapElements=function(child1,child2){var parent=child1.parent(),items=parent.children('[id]'),t;if(Math.abs(ploneDnDReorder.getPos(child1)-ploneDnDReorder.getPos(child2))!==1){return}
items.removeClass('even').removeClass('odd');if(child1[0].swapNode){child1[0].swapNode(child2[0])} else{t=parent[0].insertBefore(document.createTextNode(''),child1[0]);child1.insertBefore(child2);child2.insertBefore(t);$(t).remove()}
parent.children('[id]:odd').addClass('even');parent.children('[id]:even').addClass('odd')};ploneDnDReorder.doUp=function(e){var dragging=ploneDnDReorder.dragging,body=$('body');if(!dragging){return}
ploneDnDReorder.updatePositionOnServer();dragging.removeData('ploneDnDReorder.startPosition');dragging.removeData('ploneDnDReorder.subset_ids');ploneDnDReorder.rows.unbind('mousemove',ploneDnDReorder.doDrag);body.unbind('mouseup',ploneDnDReorder.doUp);body.unbind('mouseleave',ploneDnDReorder.doCancel);$(this).parents('tr').removeClass('dragindicator');return false};ploneDnDReorder.doCancel=function(e){var dragging=ploneDnDReorder.dragging,body=$('body');if(!dragging){return}
dragging.removeClass("dragging");dragging.removeClass('dragindicator');if(ploneDnDReorder.getPos(dragging)-dragging.data('ploneDnDReorder.startPosition')){ploneDnDReorder.locked=true;dragging.addClass("error")}
ploneDnDReorder.rows.unbind('mousemove',ploneDnDReorder.doDrag);body.unbind('mouseup',ploneDnDReorder.doCancel);body.unbind('mouseleave',ploneDnDReorder.doCancel);ploneDnDReorder.dragging=null;return false};ploneDnDReorder.updatePositionOnServer=function(){var dragging=ploneDnDReorder.dragging,delta,args,encoded;if(!dragging){return}
delta=ploneDnDReorder.getPos(dragging)-dragging.data('ploneDnDReorder.startPosition');if(delta===0){ploneDnDReorder.doCancel.call();return}
args={item_id:dragging.attr('id').substr('folder-contents-item-'.length),subset_ids:dragging.data('ploneDnDReorder.subset_ids')};args['delta:int']=delta;encoded=$.param(args).replace(/%5B%5D=/g,'%3Alist=');$.ajax({type:'POST',url:'folder_moveitem',data:encoded,complete:ploneDnDReorder.complete});ploneDnDReorder.locked=true};ploneDnDReorder.complete=function(xhr,textStatus){var dragging=ploneDnDReorder.dragging;dragging.removeClass("dragging");dragging.removeClass('dragindicator');if(textStatus==="success"||textStatus==="notmodified"){ploneDnDReorder.locked=false} else{dragging.addClass("error")}
ploneDnDReorder.dragging=null}}(jQuery));
function initializeDnDReorder(table_selector){var table=table_selector;ploneDnDReorder.table=$(table);if(!ploneDnDReorder.table.length)
return;ploneDnDReorder.rows=$(table+" > tr,"+table+" > tbody > tr");$(table+" > tr > td.draggable,"+table+" > tbody > tr > td.draggable").not('.notDraggable').mousedown(ploneDnDReorder.doDown).mouseup(ploneDnDReorder.doUp).addClass("draggingHook").css("cursor","ns-resize").html('&#x28ff;')}
$(document).ready(function(){initializeDnDReorder('#listing-table')});

/* - collapsiblesections.js - */
// http://plone.org/portal_javascripts/collapsiblesections.js?original=1
function activateCollapsibles(){(function($){$('dl.collapsible:not([class$=Collapsible])').find('dt.collapsibleHeader:first').click(function(){var c=$(this).parents('dl.collapsible:first'),t;if(!c){return true}t=c.hasClass('inline')?'Inline':'Block';c.toggleClass('collapsed'+t+'Collapsible').toggleClass('expanded'+t+'Collapsible')}).end().each(function(){var s=$(this).hasClass('collapsedOnLoad')?'collapsed':'expanded',t=$(this).hasClass('inline')?'Inline':'Block';$(this).removeClass('collapsedOnLoad').addClass(s+t+'Collapsible')})}(jQuery))}jQuery(function($){$(activateCollapsibles)});

/* - form_tabbing.js - */
// http://plone.org/portal_javascripts/form_tabbing.js?original=1
var ploneFormTabbing={jqtConfig:{current:'selected'},max_tabs:6};(function($){ploneFormTabbing._buildTabs=function(container,legends){var threshold=legends.length>ploneFormTabbing.max_tabs;var panel_ids,tab_ids=[],tabs='';for(var i=0;i<legends.length;i++){var className,tab,legend=legends[i],lid=legend.id;tab_ids[i]='#'+lid;switch(i){case(0):className='class="formTab firstFormTab"';break;case(legends.length-1):className='class="formTab lastFormTab"';break;default:className='class="formTab"';break}
if(threshold){tab='<option '+className+' id="'+lid+'" value="'+lid+'">';tab+=$(legend).text()+'</option>'} else{tab='<li '+className+'><a id="'+lid+'" href="#'+lid+'"><span>';tab+=$(legend).text()+'</span></a></li>'}
tabs+=tab;$(legend).css({'visibility':'hidden','font-size':'0','padding':'0','height':'0','width':'0','line-height':'0'})}
tab_ids=tab_ids.join(',');panel_ids=tab_ids.replace(/#fieldsetlegend-/g,"#fieldset-");if(threshold){tabs=$('<select class="formTabs">'+tabs+'</select>');tabs.change(function(){var selected=$(this).attr('value');$(this).parent().find('option#'+selected).click()})} else{tabs=$('<ul class="formTabs">'+tabs+'</ul>')}
return tabs};ploneFormTabbing.initializeDL=function(){var ftabs=$(ploneFormTabbing._buildTabs(this,$(this).children('dt')));var targets=$(this).children('dd');$(this).before(ftabs);targets.addClass('formPanel');ftabs.tabs(targets,ploneFormTabbing.jqtConfig)};ploneFormTabbing.initializeForm=function(){var jqForm=$(this);var fieldsets=jqForm.children('fieldset');if(!fieldsets.length){return}
var ftabs=ploneFormTabbing._buildTabs(this,fieldsets.children('legend'));$(this).prepend(ftabs);fieldsets.addClass("formPanel");$(this).find('input[name="fieldset"]').addClass('noUnloadProtection');$(this).find('.formPanel:has(div.field span.required)').each(function(){var id=this.id.replace(/^fieldset-/,"#fieldsetlegend-");$(id).addClass('required')});var initialIndex=0;var count=0;var found=false;$(this).find('.formPanel').each(function(){if(!found&&$(this).find('div.field.error').length!=0){initialIndex=count;found=true}
count+=1});var tabSelector='ul.formTabs';if($(ftabs).is('select.formTabs')){tabSelector='select.formTabs'}
var tabsConfig=$.extend({},ploneFormTabbing.jqtConfig,{'initialIndex':initialIndex});jqForm.children(tabSelector).tabs(jqForm.children('fieldset.formPanel'),tabsConfig);jqForm.submit(function(){var selected;if(ftabs.find('a.selected').length>=1){selected=ftabs.find('a.selected').attr('href').replace(/^#fieldsetlegend-/,"#fieldset-")}
else{selected=ftabs.attr('value').replace(/^fieldsetlegend-/,'#fieldset-')}
var fsInput=jqForm.find('input[name="fieldset"]');if(selected&&fsInput){fsInput.val(selected)}});$("#archetypes-schemata-links").addClass('hiddenStructure');$("div.formControls input[name='form.button.previous'],"+"div.formControls input[name='form.button.next']").remove()};$.fn.ploneTabInit=function(pbo){return this.each(function(){var item=$(this);item.find("form.enableFormTabbing,div.enableFormTabbing").each(ploneFormTabbing.initializeForm);item.find("dl.enableFormTabbing").each(ploneFormTabbing.initializeDL);var targetPane=item.find('.enableFormTabbing input[name="fieldset"]').val()||window.location.hash;if(targetPane){item.find(".enableFormTabbing .formTabs "+targetPane.replace("'","").replace(/^#fieldset-/,"#fieldsetlegend-")).click()}})};ploneFormTabbing.initialize=function(){$('body').ploneTabInit()}})(jQuery);jQuery(function(){ploneFormTabbing.initialize()});

/* - popupforms.js - */
// http://plone.org/portal_javascripts/popupforms.js?original=1
var common_content_filter='#content>*:not(div.configlet),dl.portalMessage.error,dl.portalMessage.info';var common_jqt_config={fixed:false,speed:'fast',mask:{color:'#fff',opacity:0.4,loadSpeed:0,closeSpeed:0}};jQuery.extend(jQuery.tools.overlay.conf,common_jqt_config);jQuery(function($){if(jQuery.browser.msie&&parseInt(jQuery.browser.version,10)<7){return}
function noformerrorshow(el,noform){var o=$(el),emsg=o.find('dl.portalMessage.error');if(emsg.length){o.children().replaceWith(emsg);return false} else{return noform}}
function redirectbasehref(el,responseText){var mo=responseText.match(/<base href="(\S+?)"/i);if(mo.length===2){return mo[1]}
return location}
$('#portal-personaltools a[href$="/login"], #portal-personaltools a[href$="/login_formX"], .discussion a[href$="/login_form"]').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'form#login_form',noform:'redirect',redirect: function(){var href=location.href.replace('http:','https');if(href.search(/pwreset_finish$/)>=0){return href.slice(0,href.length-14)+'logged_in'} else{return href}}});$('#siteaction-contact a').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'form[name="feedback_form"]',noform: function(el){return noformerrorshow(el,'close')}});$('form[name="reply"]').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'form:has(input[name="discussion_reply:method"])',noform: function(el){return noformerrorshow(el,'redirect')},redirect:redirectbasehref});$('#contextSetDefaultPage, #folderChangeDefaultPage').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'form[name="default_page_form"]',noform: function(el){return noformerrorshow(el,'reload')},closeselector:'[name="form.button.Cancel"]',width:'40%'});$('dl#plone-contentmenu-actions a#delete').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'#delete_confirmation',noform: function(el){return noformerrorshow(el,'redirect')},redirect:redirectbasehref,closeselector:'[name="form.button.Cancel"]',width:'50%'});$('dl#plone-contentmenu-actions a#rename').prepOverlay({subtype:'ajax',filter:common_content_filter,closeselector:'[name="form.button.Cancel"]',width:'40%'});$('#portal-personaltools a[href$="/@@register"]').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'form.kssattr-formname-register'});$('form[name="users_add"], form[name="groups_add"]').prepOverlay({subtype:'ajax',filter:common_content_filter,formselector:'form.kssattr-formname-new-user, form[name="groups"]',noform: function(el){return noformerrorshow(el,'redirect')},redirect: function(){return location.href}});$('#content-history a').prepOverlay({subtype:'ajax',urlmatch:'@@historyview',urlreplace:'@@contenthistorypopup'})});$(document).ready(function(){$("#accordion").tabs("#accordion div.pane",{tabs:'h2',effect:'slide',initialIndex:null})});

/* - jquery.highlightsearchterms.js - */
// http://plone.org/portal_javascripts/jquery.highlightsearchterms.js?original=1
(function($){var Highlighter,makeSearchKey,makeAddress,defaults;Highlighter=function(options){$.extend(this,options);this.terms=this.cleanTerms(this.terms.length?this.terms:this.getSearchTerms())};Highlighter.prototype={highlight: function(startnode){if(!this.terms.length||!startnode.length){return}
var self=this;$.each(this.terms, function(i,term){startnode.find('*:not(textarea)').andSelf().contents().each(function(){if(this.nodeType===3){self.highlightTermInNode(this,term)}})})},highlightTermInNode: function(node,word){var c=node.nodeValue,self=this,highlight,ci,index,next;if($(node).parent().hasClass(self.highlightClass)){return}
highlight=function(content){return $('<span class="'+self.highlightClass+'">&nbsp;</span>').text(content)};ci=self.caseInsensitive;while(c&&(index=(ci?c.toLowerCase():c).indexOf(word))>-1){$(node).before(document.createTextNode(c.substr(0,index))).before(highlight(c.substr(index,word.length))).before(document.createTextNode(c.substr(index+word.length)));next=node.previousSibling;$(node).remove();node=next;c=node.nodeValue}},queryStringValue: function(uri,regexp){var match,pair;if(uri.indexOf('?')<0){return ''}
uri=uri.substr(uri.indexOf('?')+1);while(uri.indexOf('=')>=0){uri=uri.replace(/^\&*/,'');pair=uri.split('&',1)[0];uri=uri.substr(pair.length);match=pair.match(regexp);if(match){return decodeURIComponent(match[match.length-1].replace(/\+/g,' '))}}
return ''},termsFromReferrer: function(){var ref,i,se;ref=$.fn.highlightSearchTerms._test_referrer!==null?$.fn.highlightSearchTerms._test_referrer:document.referrer;if(!ref){return ''}
for(i=0;i<this.referrers.length;i+=1){se=this.referrers[i];if(ref.match(se.address)){return this.queryStringValue(ref,se.key)}}
return ''},cleanTerms: function(terms){var self=this;return $.unique($.map(terms, function(term){term=$.trim(self.caseInsensitive?term.toLowerCase():term);return(!term||self.filterTerms.test(term))?null:term}))},getSearchTerms: function(){var terms=[],uri=$.fn.highlightSearchTerms._test_location!==null?$.fn.highlightSearchTerms._test_location:location.href;if(this.useReferrer){$.merge(terms,this.termsFromReferrer().split(/\s+/))}
if(this.useLocation){$.merge(terms,this.queryStringValue(uri,this.searchKey).split(/\s+/))}
return terms}};makeSearchKey=function(key){return(typeof key==='string')?new RegExp('^'+key+'=(.*)$','i'):key};makeAddress=function(addr){return(typeof addr==='string')?new RegExp('^https?://(www\\.)?'+addr,'i'):addr};$.fn.highlightSearchTerms=function(options){options=$.extend({},defaults,options);options=$.extend(options,{searchKey:makeSearchKey(options.searchKey),referrers:$.map(options.referrers, function(se){return{address:makeAddress(se.address),key:makeSearchKey(se.key)}})});if(options.includeOwnDomain){var hostname=$.fn.highlightSearchTerms._test_location!==null?$.fn.highlightSearchTerms._test_location:location.hostname;options.referrers.push({address:makeAddress(hostname.replace(/\./g,'\\.')),key:options.searchKey})}
new Highlighter(options).highlight(this);return this};$.fn.highlightSearchTerms.referrers=[{address:'google\\.',key:'q'},{address:'search\\.yahoo\\.',key:'p'},{address:'search\\.msn\\.',key:'q'},{address:'search\\.live\\.',key:'query'},{address:'search\\.aol\\.',key:'userQuery'},{address:'ask\\.com',key:'q'},{address:'altavista\\.',key:'q'},{address:'feedster\\.',key:'q'}];defaults={terms:[],useLocation:true,searchKey:'(searchterm|SearchableText)',useReferrer:true,referrers:$.fn.highlightSearchTerms.referrers,includeOwnDomain:true,caseInsensitive:true,filterTerms:/(not|and|or)/i,highlightClass:'highlightedSearchTerm'};$.fn.highlightSearchTerms._test_location=null;$.fn.highlightSearchTerms._test_referrer=null;$.fn.highlightSearchTerms._highlighter=Highlighter}(jQuery));jQuery(function($){$('#region-content,#content').highlightSearchTerms({includeOwnDomain:$('dl.searchResults').length===0})});

/* - first_input_focus.js - */
// http://plone.org/portal_javascripts/first_input_focus.js?original=1
jQuery(function($){if($("form div.error :input:first").focus().length){return}
$("form.enableAutoFocus :input:not(.formTabs):visible:first").focus()});

/* - accessibility.js - */
// http://plone.org/portal_javascripts/accessibility.js?original=1
function setBaseFontSize(f,r){var b=jQuery('body');if(r){b.removeClass('smallText').removeClass('largeText');createCookie("fontsize",f,365)}b.addClass(f)}jQuery(function($){var f=readCookie("fontsize");if(f){setBaseFontSize(f,0)}});

/* - styleswitcher.js - */
// http://plone.org/portal_javascripts/styleswitcher.js?original=1
function setActiveStyleSheet(title,reset){jQuery('link[rel*=style][title]').attr('disabled',true).find('[title='+title+']').attr('disabled',false);if(reset){createCookie("wstyle",title,365)}}
jQuery(function(){var style=readCookie("wstyle");if(style){setActiveStyleSheet(style,0)}});

/* - toc.js - */
// http://plone.org/portal_javascripts/toc.js?original=1
jQuery(function($){var dest,content,location,stack,oltoc,numdigits,wlh,target,targetOffset;dest=$('dl.toc dd.portletItem');content=$('#region-content,#content');if(!content||!dest.length){return}
dest.empty();location=window.location.href;if(window.location.hash){location=location.substring(0,location.lastIndexOf(window.location.hash))}
stack=[];$(content).find('*').not('.comment > h3').filter(function(){return (/^h[1234]$/).test(this.tagName.toLowerCase())}).not('.documentFirstHeading').each(function(i){var level,ol,li;level=this.nodeName.charAt(1);while(stack.length<level){ol=$('<ol>');if(stack.length){li=$(stack[stack.length-1]).children('li:last');if(!li.length){li=$('<li>').appendTo($(stack[stack.length-1]))}
li.append(ol)}
stack.push(ol)}
while(stack.length>level){stack.pop()}
$(this).before($('<a name="section-'+i+'" />'));$('<li>').append($('<a />').attr('href',location+'#section-'+i).text($(this).text())).appendTo($(stack[stack.length-1]))});if(stack.length){var oltoc=$(stack[0]);var i=1;while(oltoc.children('li').length==1){oltoc=$(stack[i]);i+=1}
if(i<=stack.length){$('dl.toc').show()}
numdigits=oltoc.children().length.toString().length;oltoc.addClass("TOC"+numdigits+"Digit");dest.append(oltoc);wlh=window.location.hash;if(wlh){target=$(wlh);target=target.length&&target||$('[name="'+wlh.slice(1)+'"]');targetOffset=target.offset();if(targetOffset){$('html,body').animate({scrollTop:targetOffset.top},0)}}}});

/* - collapsibleformfields.js - */
// http://plone.org/portal_javascripts/collapsibleformfields.js?original=1
(function($){$.fn.do_search_collapse=function(){
function check_used(element){var e=$(element);if(e.find('input[id$=_toggle]:checkbox').length>0){if(e.find('input[id$=_toggle]:checkbox:checked').length===0){return true}}
if(e.find(':text[value]').length>0){return true}
if(e.find('select .default_option').length>0){if(e.find('select .default_option:selected').length===0){return true}}
return false}
return this.each( function(){var indicator=$(this).find('.collapser:first'),collapse=$(this).find('.collapse:first');indicator.click(function(){var container=$(this).parent(),target=container.find('.collapse:first');target.slideToggle('normal');$(this).toggleClass('expanded');$(this).toggleClass('collapsed')});if(check_used(this)){indicator.addClass('expanded')} else{collapse.hide();indicator.addClass('collapsed')}})};jQuery(function($){$('.field.collapsible').do_search_collapse()})}(jQuery));

/* - dropdown.js - */
// http://plone.org/portal_javascripts/dropdown.js?original=1
function hideAllMenus(){jQuery('dl.actionMenu').removeClass('activated').addClass('deactivated')}
function toggleMenuHandler(event){jQuery(this).parents('.actionMenu:first').toggleClass('deactivated').toggleClass('activated');return false}
function actionMenuDocumentMouseDown(event){if(jQuery(event.target).parents('.actionMenu:first').length){return true}
hideAllMenus()}
function actionMenuMouseOver(event){var menu_id=jQuery(this).parents('.actionMenu:first').attr('id'),switch_menu;if(!menu_id){return true}
switch_menu=jQuery('dl.actionMenu.activated').length>0;jQuery('dl.actionMenu').removeClass('activated').addClass('deactivated');if(switch_menu){jQuery('#'+menu_id).removeClass('deactivated').addClass('activated')}}
function initializeMenus(){jQuery(document).mousedown(actionMenuDocumentMouseDown);hideAllMenus();jQuery('dl.actionMenu dt.actionMenuHeader a').click(toggleMenuHandler).mouseover(actionMenuMouseOver);jQuery('dl.actionMenu > dd.actionMenuContent').click(hideAllMenus)}
jQuery(initializeMenus);
