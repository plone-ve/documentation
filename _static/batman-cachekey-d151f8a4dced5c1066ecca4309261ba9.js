
/* Merged Plone Javascript file
 * This file is dynamically assembled from separate parts.
 * Some of these parts have 3rd party licenses or copyright information attached
 * Such information is valid for that section,
 * not for the entire composite file
 * originating files are separated by - filename.js -
 */

/* - batman.js - */
// http://plone.org/portal_javascripts/batman.js?original=1
(function($){$(document).ready(function(){var loaded=false;$('#search-site,#searchGadget').keypress(function(){if($(this).val()=='batman'){var audio=new Audio('batman_theme_x.ogg');audio.play();var logo=$('<img src="http://plone.org/foundation/logo/plone-logo-128-white-bg.png" />').clone();$('body').prepend(logo);logo.addClass('batlogo');$('#outer-wrapper').addClass('batman');setTimeout(function(){logo.remove();$('#outer-wrapper').removeClass('batman');audio.stop()},6000)}
if($(this).val()=='emerald'){$('<a href="//plone.org/community/gin-apocrypha"></a>').appendTo('body').prepOverlay({subtype:'ajax',filter:'#content *'}).click()}})})})(jQuery);

/* - ++resource++mr.crabby/crabby.js - */
// http://plone.org/portal_javascripts/++resource++mr.crabby/crabby.js?original=1
jQuery(function($){var loaded=false;$('#search-site,#searchGadget').keypress(function(){var $crab=$('.crabby');if(!$crab.length){$crab=$('<div class="crabby"><div class="arm"><div class="claw"></div></div></div>').appendTo('body')}
if($(this).val()=='cioppino'){$crab.addClass('attacking');$(document).bind('click', function(){$crab.removeClass('attacking')})}})});

/* - login.js - */
// http://plone.org/portal_javascripts/login.js?original=1
$(function(){var url=window.location.href;$("#login-link").click(function(){$('#came-from-input').val(url);$("#login-popup").slideToggle();return false});$("#login-slide-form").submit(function(){if(url.indexOf('http://plone.org')!=0&&url.indexOf('https://plone.org')!=0){if(url.indexOf('http://staging.plone.org')==0||url.indexOf('https://staging.plone.org')==0){$(this).attr('action','https://staging.plone.org/login_form')} else{$(this).attr('action','/plone.org/login_form')}}})});

/* - kss-bbb.js - */
// http://plone.org/portal_javascripts/kss-bbb.js?original=1
(function($){
function refreshPortlet(hash,_options){var options={data:{},success: function(){},error: function(){},ajaxOptions:{}};$.extend(options,_options);options.data.portlethash=hash;ajaxOptions=options.ajaxOptions;ajaxOptions.url=$('base').attr('href')+'/@@render-portlet';ajaxOptions.success=function(data){var container=$('[data-portlethash="'+hash+'"]');var portlet=$(data);container.html(portlet);options.success(data,portlet)}
ajaxOptions.error=function(){options.error()}
ajaxOptions.data=options.data;$.ajax(ajaxOptions)}
$('body').delegate('#calendar-next,#calendar-previous','click', function(){var el=$(this);var container=el.parents('.portletWrapper');refreshPortlet(container.data('portlethash'),{data:{month:el.data('month'),year:el.data('year')}});return false});
function applyPortletTimeout(portlet){var timeout=portlet.data('timeout');if(timeout==undefined){timeout=30}else{timeout=parseInt(timeout)}
timeout=timeout * 1000;setTimeout($.proxy(function(){refreshPortlet(this.parents('.portletWrapper').data('portlethash'),{success: function(data,portlet){apply_timeout(portlet)}})},portlet),timeout)}
$(document).ready(function(){var spinner=$('<div id="ajax-spinner"><img src="'+portal_url+'/spinner.gif" alt=""/></div>');spinner.appendTo('body').hide();$(document).ajaxStart(function(){spinner.show()});$(document).ajaxStop(function(){spinner.hide()});$('.kssPortletRefresh,.refreshPortlet').each(function(){applyPortletTimeout($(this))});$('.portlet-deferred').each(function(){refreshPortlet($(this).parents('.portletWrapper').data('portlethash'))});
function updateSharing(data){var sharing=$(data.body);var messages=$(data.messages).filter(function(){return this.tagName=='DL'});$('.portalMessage').remove();$('#user-group-sharing').replaceWith(sharing);$('#content').prepend(messages)}
var search_timeout=null;$('#content-core').delegate('#sharing-user-group-search','change input', function(){var text=$(this);if(search_timeout!=null){clearTimeout(search_timeout)}
if(text.val().length>3){search_timeout=setTimeout($.proxy(function(){$('#sharing-search-button').trigger('click')},text),300)}});$('#content-core').delegate('#sharing-search-button','click', function(){$.ajax({url:$('base').attr('href')+'/@@updateSharingInfo',data:{search_term:$('#sharing-user-group-search').val(),'form.button.Search':'Search'},type:'GET',dataType:'json',success:updateSharing});return false});$('#content-core').delegate('#sharing-save-button','click', function(){var btn=$(this);var form=btn.parents('form');var data=form.serializeArray();data.push({name:'form.button.Save',value:'Save'});$.ajax({url:$('base').attr('href')+'/@@updateSharingInfo',data:data,type:'POST',dataType:'json',success:updateSharing});return false})})})(jQuery);

/* - inline_validation.js - */
// http://plone.org/portal_javascripts/inline_validation.js?original=1
jQuery(function($){var render_error=function($field,errmsg){var $errbox=$('div.fieldErrorBox',$field);if(errmsg!==''){$field.addClass('error');$errbox.html(errmsg)} else{$field.removeClass('error');$errbox.html('')}};$('.field input.blurrable,.field select.blurrable,.field textarea.blurrable').live('blur', function(){var $input=$(this),$field=$input.closest('.field'),uid=$field.attr('data-uid'),fname=$field.attr('data-fieldname'),value=$input.val();if($field&&uid&&fname){$.post($('base').attr('href')+'/at_validate_field',{uid:uid,fname:fname,value:value}, function(data){render_error($field,data.errmsg)})}});var formlib_validate_field=function(input){var $input=$(input),$field=$input.closest('.field'),$form=$field.closest('form'),fname=$field.attr('data-fieldname');$form.ajaxSubmit({url:$form.attr('action')+'/@@formlib_validate_field',data:{fname:fname},iframe:false,success: function(data){render_error($field,data.errmsg)},dataType:'json'})};$('.formlibInlineValidation input[type="text"]').live('blur', function(){formlib_validate_field(this)});$('.formlibInlineValidation input[type="password"]').live('blur', function(){formlib_validate_field(this)});$('.formlibInlineValidation input[type="checkbox"]').live('blur', function(){formlib_validate_field(this)});$('.formlibInlineValidation input[type="radio"]').live('blur', function(){formlib_validate_field(this)});$('.formlibInlineValidation select').live('blur', function(){formlib_validate_field(this)});$('.formlibInlineValidation textarea').live('blur', function(){formlib_validate_field(this)});var z3cform_validate_field=function(input){var $input=$(input),$field=$input.closest('.field'),$form=$field.closest('form'),fset=$input.closest('fieldset').attr('data-fieldset'),fname=$field.attr('data-fieldname');$form.ajaxSubmit({url:$form.attr('action')+'/@@z3cform_validate_field',data:{fname:fname,fset:fset},iframe:false,success: function(data){render_error($field,data.errmsg)},dataType:'json'})};$('.z3cformInlineValidation input[type="text"]').live('blur', function(){z3cform_validate_field(this)});$('.z3cformInlineValidation input[type="password"]').live('blur', function(){z3cform_validate_field(this)});$('.z3cformInlineValidation input[type="checkbox"]').live('blur', function(){z3cform_validate_field(this)});$('.z3cformInlineValidation input[type="radio"]').live('blur', function(){z3cform_validate_field(this)});$('.z3cformInlineValidation select').live('blur', function(){z3cform_validate_field(this)});$('.z3cformInlineValidation textarea').live('blur', function(){z3cform_validate_field(this)})});

/* - ++resource++poi/poi.js - */
// http://plone.org/portal_javascripts/++resource++poi/poi.js?original=1
jQuery(function($){if(!jQuery.browser.msie||parseInt(jQuery.browser.version,10)>=7){$('#poi-login-form').prepOverlay({subtype:'ajax',filter:'#content>*',formselector:'#content-core > form',noform:'reload',closeselector:'[name=form.buttons.cancel]',})}});
