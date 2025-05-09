---
myst:
  html_meta:
    "description": "Viewlets in Plone 6 Classic UI"
    "property=og:description": "Viewlets in Plone 6 Classic UI"
    "property=og:title": "Viewlets in Plone 6 Classic UI"
    "keywords": "Plone 6, Classic UI, viewlets, snippets"
---

(classic-ui-viewlets-label)=

# Viewlets

Viewlets are view snippets which will render a part of the HTML page.

Viewlets provide a conflict-free way to contribute new user interface actions and HTML snippets to Plone pages.
They can be injected into different areas of a page, such as above or below the content, or above or below the page title.

Similar to views, viewlets are usually a combination of:

-   a Python class, which performs the user interface logic setup, and
-   corresponding {doc}`/classic-ui/templates`, or direct Python string output.

```{eval-rst}
.. graphviz::
    :align: center

    digraph viewletstructure {
      {
        node [margin=5,shape=box]
      }
      ZCML -> {Python, Template};
    }
```

Each viewlet is associated with a {ref}`classic-ui-viewlets-viewletmanager-label`.

Common viewlet managers and their viewlets are:

-   `plone.abovecontent`
    -   `plone.path_bar`
    -   `plone.lockinfo`
-   `plone.globalstatusmessage`
    -   `plone.globalstatusmessage`
-   `plone.abovecontenttitle`
    -   `plone.socialtags`
    -   `contentleadimage`
-   `plone.belowcontenttitle`
    -   `plone.documentbyline`
-   `plone.abovecontentbody`
    -   `plone.tableofcontents`
-   `plone.belowcontentbody`
    -   `plone.contributors`
    -   `plone.rights`
    -   `plone.keywords`
    -   `plone.relateditems`
-   `plone.belowcontent`
    -   `plone.documentactions`
    -   `plone.nextprevious`
    -   `plone.comments`
-   `plone.toolbar`
    -   `plone.contentviews`


To get an overview of all `viewlet manager` and viewlets in the current context, you can use the `@@manage-viewlets` view.

To add viewlets to your HTML code, you first need to add them to a viewlet manager, which allows you to shuffle viewlets around through-the-web.


## What viewlets do

-   Viewlets can be managed using the `/@@manage-viewlets` view.
-   Viewlets can be shown and hidden through-the-web.
-   Viewlets can be reordered (limited to reordering within a `viewlet manager`).
-   Viewlets can be registered and overridden in a theme specific manner using {doc}`/classic-ui/layers`.
-   Viewlets have `update()` and `render()` methods.
-   Viewlets should honor [`zope.contentprovider.interfaces.IContentProvider`'s call contract](https://github.com/zopefoundation/zope.contentprovider/blob/master/src/zope/contentprovider/interfaces.py), documented in [`zope.contentprovider`](https://zopecontentprovider.readthedocs.io/en/latest/).

A viewlet can be configured so that it is only available for:

-   a certain interface, typically a content type (`for=` in ZCML)
-   a certain view (`view=` in ZCML)


## Finding viewlets

There are two through-the-web tools to find the available viewlets on your installation.
The available viewlets may depend on your installed Plone version and installed add-ons.

-   The `portal_view_customizations` tool in the Management Interface will show you viewlet registrations (and the viewlet managers they are registered for).
    As with views, you can hover over the viewlet name to see where it is registered in a tool tip.
-   To discover the name of a particular viewlet, you can use the `@@manage-viewlets` view, such as <http://localhost:8080/plone/@@manage-viewlets>.


## Managing viewlets

You can order, hide, and unhide or show viewlets.
The next sections describe how to do so.


### Order viewlets

To set the order of a viewlet inside its viewlet manager, use the following `GenericSetup` configuration.

```xml
<order manager="plone.belowcontentbody" skinname="*">
  <viewlet name="plone.relateditems" insert-before="*"/>
</order>
```

```{note}
You cannot move viewlets between viewlet managers.
Hide the concerning viewlets in one manager using `/@@manage-viewlets` and {file}`viewlets.xml` export, then re-register the same viewlet to a new manager.
You also have to change the {ref}`classic-ui-viewlets-viewletmanager-label` class in the `ZCML` registration of the viewlet.
See {ref}`classic-ui-viewlets-registering-viewlet-zcml-label`.
```


### Hide viewlets

You can hide a viewlet from the {file}`viewlets.xml` with the `<hidden />` node, which is at same level as `<order />`, and is done per skin selection.

For instance, if you need to remove the global sections for your skin, you'd have to add some declaration, such as the following one in {file}`viewlets.xml`:

```xml
<hidden manager="plone.portalheader" skinname="My Theme">
  <viewlet name="plone.global_sections" />
</hidden>
```


### Unhide viewlets

If, for any reason, you need to unhide one or more viewlets for a given viewlet manager, you can make use of the `purge` and `remove` node parameters in your `<hidden />` declaration in {file}`viewlets.xml`.

To unhide all hidden viewlets for a given viewlet manager:

```xml
<?xml version="1.0"?>
<object>
  <hidden manager="plone.portalheader" skinname="Plone Default"
          purge="True" />
</object>
```

To unhide a specific viewlet:

```xml
<?xml version="1.0"?>
<object>
  <hidden manager="plone.portalheader" skinname="Plone Default">
    <viewlet name="plone.global_sections" remove="True" />
  </hidden>
</object>
```

```{note}
The `purge` and `remove` node parameters are also supported inside the `<order />` declaration.
```


## Custom viewlet

A viewlet consists of a

-   Python class
-   page template (`.pt`) file
-   {doc}`browser layer </classic-ui/layers>` defining which add-on product must be installed, so that the viewlet is rendered
-   `ZCML` directive to register the viewlet to a correct viewlet manager with a correct layer


### Re-use code from a view

When you want a viewlet and view to share the same code, remember that the view instance is available in the viewlet under the `view` attribute.

Thus, you can use `self.view` to get the view, and then use its methods.


### Anatomy of a Viewlet

Viewlets have two important methods.

`update()`
:   Set up all variables.

`render()`
:   Generate the resulting HTML code by evaluating the template with context variables set up in `update()`.

These methods should honor the [`zope.contentprovider.interfaces.IContentProvider` call contract](https://github.com/zopefoundation/zope.contentprovider/blob/3.7.2/src/zope/contentprovider/interfaces.py).

```{seealso}
-   [`zope.contentprovider.interfaces`](https://github.com/zopefoundation/zope.contentprovider/blob/3.7.2/src/zope/contentprovider/interfaces.py)
-   [`plone.app.layout.viewlets.common`](https://github.com/plone/plone.app.layout/blob/master/plone/app/layout/viewlets/common.py)
```


### Creating a viewlet

```{todo}
Convert example to use `plonecli`.
```

```{todo}
Consider migrating the [ZCML documentation](https://5.docs.plone.org/develop/addons/components/zcml.html) from Plone 5 to Plone 6 Documentation.
```

The following Python code example, such as in a file {file}`viewlets.py`, extends an existing Plone `base` viewlet (found from the `plone.app.layout.viewlets.base` package), then puts this viewlet into one of viewlet managers using [ZCML](https://5.docs.plone.org/develop/addons/components/zcml.html).

```{todo}
The following Facebook like viewlet example is obsolete (note that links use `http`) and needs to be replaced with a modern one.
The concept is valid, but the code will not actually work with Facebook.
For a somewhat more recent example, see {doc}`training-2023:mastering-plone-5/viewlets_1` in the Master Plone 5 training.
```

```python
"""
Facebook like viewlet for Plone.
http://mfabrik.com
"""

import urllib

from plone.app.layout.viewlets import common as base

class LikeViewlet(base.ViewletBase):
    """ Add a Like button

    http://developers.facebook.com/docs/reference/plugins/like
    """

    def contructParameters(self):
        """ Create HTTP GET query parameters send to Facebook used to render the button.

        href=http%253A%252F%252Fexample.com%252Fpage%252Fto%252Flike&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=like&amp;font&amp;colorscheme=light&amp;height=80
        """


        context = self.context.aq_inner
        href = context.absolute_url()

        params = {
                  "href" : href,
                  "layout" : "standard",
                  "show_faces" : "true",
                  "width" : "450",
                  "height" : "40",
                  "action" : "like",
                  "colorscheme" : "light",
        }

        return params

    def getIFrameSource(self):
        """
        @return: <iframe src=""> string
        """
        params = self.contructParameters()
        return "http://www.facebook.com/plugins/like.php" + "?" + urllib.urlencode(params)


    def getStyle(self):
        """ Construct CSS style for Like-button IFRAME.

        Use width and height from contstructParameters()

        style="border:none; overflow:hidden; width:450px; height:80px;"

        @return: style="" for <iframe>
        """
        params = self.contructParameters()
        return "margin-left: 10px; border:none; overflow:hidden; width:{}px; height:{}px;".format(params["width"], params["height"])
```

Then in a sample page template ({file}`like.pt`), you can use the TAL template variable `view` to refer to your viewlet class instance.

```html
<iframe scrolling="no"
        frameborder="0"
        allowTransparency="true"
        tal:attributes="src view/getIFrameSource; style view/getStyle"
        >
</iframe>
```


(classic-ui-viewlets-registering-viewlet-zcml-label)=

### Registering a viewlet using ZCML

The following code is an example configuration of ZCML.
You usually map `<viewlet>` to the `browser/configure.zcml` folder.

```xml
<configure
    xmlns="http://namespaces.zope.org/zope"
    xmlns:five="http://namespaces.zope.org/five"
    xmlns:browser="http://namespaces.zope.org/browser"
    xmlns:genericsetup="http://namespaces.zope.org/genericsetup"
    i18n_domain="mfabrik.like">

    <browser:viewlet
      name="mfabrik.like"
      manager="plone.app.layout.viewlets.interfaces.IBelowContent"
      template="like.pt"
      layer="mfabrik.like.interfaces.IAddOnInstalled"
      permission="zope2.View"
      />

</configure>
```


#### Overriding a viewlet registration

To change a viewlets manager, we can override the registration in our custom Plone add-on package as follows:

```xml
<!-- move contentleadimage viewlet to different viewletmanager -->
<configure package="plone.app.contenttypes.behaviors">
    <browser:viewlet
        name="contentleadimage"
        for="plone.app.contenttypes.behaviors.leadimage.ILeadImage"
        view="plone.app.layout.globals.interfaces.IViewView"
        manager="plone.app.layout.viewlets.interfaces.IBelowContentTitle"
        class="plone.app.contenttypes.behaviors.viewlets.LeadImageViewlet"
        template="leadimage.pt"
        permission="zope2.View"
        layer="collective.example.interfaces.IExampleLayer"
        />
</configure>
```

The override is done here, with the help of a browser layer.
An alternative way would be to put the registration without a browser layer into a {file}`overrides.zcml` in the package root of your add-on.


### Conditionally render viewlets

There are two primary methods to render viewlets only on some pages.

-   Register the viewlet against some marker interface or content type class.
    The viewlet is rendered on this content type only.
    You can use [dynamic marker interfaces](https://5.docs.plone.org/develop/addons/components/interfaces.html) to toggle the interface on some individual pages through the Management Interface.
-   Hard-code a condition to your viewlet in Python code.

The following example overrides a `render()` method to conditionally render your viewlet.

```python
import Acquisition
from zope.component import getUtility

from plone.app.layout.viewlets import common as base
from plone.registry.interfaces import IRegistry


class LikeViewlet(base.ViewletBase):
    """ Add a Like button

    http://developers.facebook.com/docs/reference/plugins/like
    """

    def isEnabledOnContent(self):
        """
        @return: True if the current content type supports Like-button
        """
        registry = getUtility(IRegistry)
        content_types = registry['mfabrik.like.content_types']

        # Don't assume that all content items would have portal_type attribute
        # available (might be changed in the future / very specialized content)
        current_content_type = portal_type = getattr(
            Acquisition.aq_base(self.context), 'portal_type', None)

        # Note that plone.registry keeps values as unicode strings
        # make sure that we have one also
        current_content_type = unicode(current_content_type)

        return current_content_type in content_types


    def render(self):
        """ Render viewlet only if it is enabled.

        """

        # Perform some condition check
        if self.isEnabledOnContent():
            # Call parent method which performs the actual rendering
            return super(LikeViewlet, self).render()
        else:
            # No output when the viewlet is disabled
            return ""
```


### Render a viewlet by name

The following code is a complex example of how to expose viewlets without going through a viewlet manager.

```python
from Acquisition import aq_inner
import zope.interface

from plone.app.customerize import registration

from Products.Five.browser import BrowserView

from zope.traversing.interfaces import ITraverser, ITraversable
from zope.publisher.interfaces import IPublishTraverse
from zope.publisher.interfaces.browser import IBrowserRequest
from zope.viewlet.interfaces import IViewlet
from zExceptions import NotFound

class Viewlets(BrowserView):
    """ Expose arbitrary viewlets to traversing by name.

    Exposes viewlets to templates by names.

    Example how to render plone.logo viewlet in arbitrary template code point::

        <div tal:content="context/@@viewlets/plone.logo" />

    """
    zope.interface.implements(ITraversable)

    def getViewletByName(self, name):
        """ Viewlets allow through-the-web customizations.

        Through-the-web customization magic is managed by five.customerize.
        We need to think of this when looking up viewlets.

        @return: Viewlet registration object
        """
        views = registration.getViews(IBrowserRequest)

        for v in views:

            if v.provided == IViewlet:
                # Note that we might have conflicting BrowserView with the same name,
                # thus we need to check for provided
                if v.name == name:
                    return v

        return None


    def setupViewletByName(self, name):
        """ Constructs a viewlet instance by its name.

        Viewlet update() and render() method are not called.

        @return: Viewlet instance of None if viewlet with name does not exist
        """
        context = aq_inner(self.context)
        request = self.request

        # Perform viewlet regisration look-up
        # from adapters registry
        reg = self.getViewletByName(name)
        if reg == None:
            return None

        # factory method is responsible for creating the viewlet instance
        factory = reg.factory

        # Create viewlet and put it to the acquisition chain
        # Viewlet need initialization parameters: context, request, view
        try:
            viewlet = factory(context, request, self, None).__of__(context)
        except TypeError:
            # Bad constructor call parameters
            raise RuntimeError(
                "Unable to initialize viewlet {}. Factory method {} call failed."
                    .format(name, str(factory)))

        return viewlet

    def traverse(self, name, further_path):
        """
        Allow travering into viewlets by viewlet name.

        @return: Viewlet HTML output

        @raise: RuntimeError if viewlet is not found
        """

        viewlet = self.setupViewletByName(name)
        if viewlet is None:
            raise NotFound("Viewlet does not exist by name {} for theme layer".format(name))

        viewlet.update()
        return viewlet.render()
```


### Render viewlets with accurate layout

Default viewlet managers render viewlets as concatenated HTML strings in the order of their appearance.
This is unsuitable to build complex layouts.

The following code is an example which defines a master viewlet `HeaderViewlet` which will place other viewlets into the manually tuned HTML markup below.

In the file {file}`theme/browser/header.py`:

```python
from Acquisition import aq_inner

# Use template files with acquisition support
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

# Import default Plone viewlet classes
from plone.app.layout.viewlets import common as base

# Import our customized viewlet classes
# This is important as the header.py file will ignore much of the settings
# inside the configure.zcml file describing the affected viewlets. Without
# creating this file, your viewlets will render with Plone's default settings,
# which will result in your custom changes being ignored.
import plonetheme.something.browser.common as something

def render_viewlet(factory, context, request):
    """ Helper method to render a viewlet """

    context = aq_inner(context)
    viewlet = factory(context, request, None, None).__of__(context)
    viewlet.update()
    return viewlet.render()


class HeaderViewlet(base.ViewletBase):
    """ Render header with special markup.

    Though we render viewlets internally we not inherit from the viewlet manager,
    since we do not offer the option for the site manager or integrator
    shuffle viewlets - they are fixed to our templates.
    """

    index = ViewPageTemplateFile('header_items.pt')

    def update(self):

        base.ViewletBase.update(self)

        # Dictionary containing all viewlets which are rendered inside this viewlet.
        # This is populated during render()
        self.subviewlets = {}

    def renderViewlet(self, viewlet_class):
        """ Render one viewlet

        @param viewlet_class: Class which manages the viewlet
        @return: Resulting HTML as string
        """
        return render_viewlet(viewlet_class, self.context, self.request)


    def render(self):

        # Customized viewlet
        self.subviewlets["logo"] = self.renderViewlet(something.SomethingLogoViewlet)

        # Customized viewlet
        self.subviewlets["sections"] = self.renderViewlet(something.SomethingGlobalSectionsViewlet)

        # Base Plone viewlet
        self.subviewlets["search"] = self.renderViewlet(base.SearchBoxViewlet)

        # Customized viewlet
        self.subviewlets["site_actions"] = self.renderViewlet(something.SiteActionsViewlet)

        # Call template to perform rendering
        return self.index()
```

In {file}`theme/browser/header_items.pt`:

```html
<header>
    <div id="logo">
        <div tal:replace="structure view/subviewlets/logo" />
    </div>

    <nav>
        <div tal:replace="structure view/subviewlets/sections" />
    </nav>

    <div id="search">
        <div tal:replace="structure view/subviewlets/search" />
        <div id="actions">
            <div tal:replace="structure view/subviewlets/site_actions" />
        </div>
    </div>
</header>
```

In {file}`theme/browser/configure.zcml`:

```xml
<configure xmlns="http://namespaces.zope.org/zope"
           xmlns:browser="http://namespaces.zope.org/browser"
           xmlns:plone="http://namespaces.plone.org/plone"
           xmlns:zcml="http://namespaces.zope.org/zcml"
           >

    <!--

        Public localizable site header

        See viewlets.xml for order/hidden
    -->

    <!-- Changes class and provides attributes to work with our changes -->
    <browser:viewletManager
        name="plone.portalheader"
        provides=".interfaces.ISomethingHeader"
        permission="zope2.View"
        class=".header.HeaderViewlet"
        layer=".interfaces.IThemeSpecific"
        />

    <!-- Site actions-->
    <browser:viewlet
        name="plonetheme.something.site_actions"
        class=".common.SiteActionsViewlet"
        permission="zope2.View"
        template="templates/site_actions.pt"
        layer=".interfaces.IThemeSpecific"
        allowed_attributes="site_actions"
        manager=".interfaces.ISomethingHeader"
        />

    <!-- The logo; even though we include the template attribute, it will be ignored.
         Needs to be set again in common.py -->
    <browser:viewlet
        name="plonetheme.something.logo"
        class=".common.SomethingLogoViewlet"
        permission="zope2.View"
        layer=".interfaces.IThemeSpecific"
        template="templates/logo.pt"
        manager=".interfaces.ISomethingHeader"
        />

    <!-- Searchbox -->
    <browser:viewlet
        name="plone.searchbox"
        for="*"
        class="plone.app.layout.viewlets.common.SearchBoxViewlet"
        permission="zope2.View"
        template="templates/searchbox.pt"
        layer=".interfaces.IThemeSpecific"
        manager=".interfaces.ISomethingHeader"
        />

    <!-- First level navigation; even though we include the template attribute, it will be ignored.
         Needs to be set again in common.py  -->
    <browser:viewlet
        name="plonetheme.something.global_sections"
        for="*"
        class=".common.SomethingGlobalSectionsViewlet"
        permission="zope2.View"
        template="templates/sections.pt"
        layer=".interfaces.IThemeSpecific"
        manager=".interfaces.ISomethingHeader"
        />

</configure>
```

In {file}`theme/browser/templates/portal_header.pt`

```html
<div id="portal-header">
    <div tal:replace="structure provider:plone.portalheader" />
</div>
```

In {file}`theme/browser/interfaces.py`:

```python
from plone.theme.interfaces import IDefaultPloneLayer
from zope.viewlet.interfaces import IViewletManager


class IThemeSpecific(IDefaultPloneLayer):
    """Marker interface that defines a Zope 3 browser layer.
       If you need to register a viewlet only for the
       "Something" theme, this interface must be its layer
       (in theme/viewlets/configure.zcml).
    """

class ISomethingHeader(IViewletManager):
    """Creates fixed layout for Plone header elements.
    """
```

We need to create the file {file}`common.py`, so we can tell Plone to render our custom templates for these viewlets.
Without this piece in place, our viewlets will render with Plone defaults.

In {file}`theme/browser/common.py`:

```python
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common

# You may also use index in place of render for these subclasses

class SomethingLogoViewlet(common.LogoViewlet):
    render = ViewPageTemplateFile("templates/logo.pt")

class SomethingSiteActionsViewlet(common.SiteActionsViewlet):
    render = ViewPageTemplateFile("templates/site_actions.pt")

class SomethingGlobalSectionsViewlet(common.GlobalSectionsViewlet):
    render = ViewPageTemplateFile("templates/sections.pt")
```


### Viewlets for one page only

Viewlets can be registered to one special page only using a marker interface.
This allows loading CSS files specifically to a page.

```{seealso}
[How to get a different look for some pages of a plone-site](https://www.starzel.de/blog/how-to-get-a-different-look-for-some-pages-of-a-plone-site)
```


### `<head>` viewlets

You can register custom JavaScript or CSS files to the HTML `<head>` section using viewlets.

The following code is a template file {file}`head.pt` which will be injected in the `<head>`.
This example shows how to dynamically generate `<script>` elements.

```html
<script type="text/javascript" tal:attributes="src view/getConnectScriptSource"></script>
<script tal:replace="structure view/getInitScriptTag" />
```

Then you register it against the viewlet manager `plone.app.layout.viewlets.interfaces.IHtmlHead` in {file}`configure.zcml`.

```xml
<browser:viewlet
   name="mfabrik.like.facebook-connect-head"
   class=".viewlets.FacebookConnectJavascriptViewlet"
   manager="plone.app.layout.viewlets.interfaces.IHtmlHead"
   template="facebook-connect-head.pt"
   layer="mfabrik.like.interfaces.IAddOnInstalled"
   permission="zope2.View"
   />
```

In {file}`viewlet.py`:

```python
class FacebookConnectJavascriptViewlet(LikeButtonOnConnectFacebookBaseViewlet):
    """ This will render Facebook JavaScript load in <head>.

    <head> section is retrofitted only if the viewlet is enabled.

    """

    def getConnectScriptSource(self):
        base = "http://static.ak.connect.facebook.com/connect.php/"
        return base + self.getLocale()

    def getInitScriptTag(self):
        """ Get <script> which boostraps Facebook stuff.
        """
        return '<script type="text/javascript">FB.init("%s");</script>' % self.settings.api_key

    def isEnabled(self):
        """
        @return: Should this viewlet be rendered on this page.
        """
        # Some logic based self.context here whether JavaScript should be included on this page or not
        return True


    def render(self):
        """ Render viewlet only if it is enabled.

        """

        # Perform some condition check
        if self.isEnabled():
            # Call parent method which performs the actual rendering
            return super(LikeButtonOnConnectFacebookBaseViewlet, self).render()
        else:
            # No output when the viewlet is disabled
            return ""
```


(classic-ui-viewlets-viewletmanager-label)=

## Viewlet manager

Viewlet managers contain viewlets.
A viewlet manager is itself a Zope 3 interface which contains an `OrdereredViewletManager` implementation.
`OrderedViewletManager`s store the order of the viewlets in the site database and provide the fancy `/@@manage-viewlets` output.

A viewlet manager can be rendered in a page template code using the following expression:

```xml
<div tal:replace="structure provider:viewletmanagerid" />
```

```{note}
If you get an error message `ContentProviderLookupError: viewletmanagerid`, you are trying to render a Plone page frame in a context which has no acquisition chain properly set up.
Check [exceptions documentation](https://5.docs.plone.org/manage/troubleshooting/exceptions.html#contentproviderlookuperror-plone-htmlhead) for more details.
```

Each viewlet manager allows you to shuffle viewlets inside a viewlet manager.
This is done by using the `/@@manage-viewlets` view.
These settings are stored in the site database.
A good practice is to export {file}`viewlets.xml` using `portal_setup`, and then include the necessary bits of this {file}`viewlets.xml` with your add-on installer, so that when your add-on is installed, the viewlet configuration is changed accordingly.

```{note}
You cannot move viewlets between viewlet managers through-the-web.
Hide the concerning viewlets in one manager using `/@@manage-viewlets` and {file}`viewlets.xml` export, then re-register the same viewlet to a new manager.
```

Viewlet managers are based on [`zope.viewlet.manager.ViewletManager`](https://github.com/zopefoundation/zope.viewlet/blob/master/src/zope/viewlet/manager.py)
and [`plone.app.viewletmanager.manager.OrderedViewletManager`](https://github.com/plone/plone.app.viewletmanager/blob/master/plone/app/viewletmanager/manager.py).

```{seealso}
-   [`zope.viewlet`](https://github.com/zopefoundation/zope.viewlet/blob/master/src/zope/viewlet/viewlet.py)
-   [Anatomy of a Viewlet](https://4.docs.plone.org/old-reference-manuals/plone_3_theming/elements/viewlet/anatomy.html)
```


### Custom viewlet manager

Usually viewlet managers are dummy interfaces, and the actual implementation comes from `plone.app.viewletmanager.manager.OrderedViewletManager`.

In the following code example, we put two viewlets in a new viewlet manager, so that we can create well-formed HTML and CSS that properly floats.

```{note}
This example uses extensive Python module nesting.
`plonetheme.yourtheme.browser.viewlets` is just too deep.
You really don't need to do so many levels, but the original `plone3_theme` paster templates do it in a bad way.
One of the Zen of Python tenets is "flat is better than nested".
You can just dump everything to the root of your `plonetheme.yourtheme` package.
```

In your {file}`browser/viewlets/manager.py` or similar file add the following code.

```xml
<browser:viewletManager
    name="plonetheme.yourtheme.headerbottommanager"
    provides="plonetheme.yourtheme.browser.viewlets.manager.IHeaderBottomViewletManager"
    class="plone.app.viewletmanager.manager.OrderedViewletManager"
    layer="plonetheme.yourtheme.browser.interfaces.IThemeSpecific"
    permission="zope2.View"
    template="headerbottomviewletmanager.pt"
    />
```

Then in {file}`browser/viewlets/configure.zcml`, add the following code.

```xml
<browser:viewletManager
    name="plonetheme.yourock.browser.viewlets.MyViewletManager"
    provides=".viewlets.MyViewletManager"
    class="plone.app.viewletmanager.manager.OrderedViewletManager"
    layer="plonetheme.yourock.interfaces.IThemeLayer"
    permission="zope2.View"
    />
```

Optionally you can include a template which renders some wrapping HTML around viewlets, as in {file}`browser/viewlets/headerbottomviewletmanager.pt`.

```xml
<div id="header-bottom">
  <tal:comment replace="nothing">
    <!-- Rendeder all viewlets inside this manager.
      Pull viewlets out of the manager and render then one-by-one
    -->
  </tal:comment>

  <tal:viewlets repeat="viewlet view/viewlets">
    <tal:viewlet replace="structure python:viewlet.render()" />
  </tal:viewlets>

  <div style="clear:both"><!-- --></div>
</div>
```

Next, re-register some stock viewlets against your new viewlet manager in {file}`browser/viewlets/configure.zcml`:

```xml
<!-- Re-register two stock viewlets to the new manager -->

<browser:viewlet
    name="plone.path_bar"
    for="*"
    manager="plonetheme.yourtheme.browser.viewlets.manager.IHeaderBottomViewletManager"
    layer="plonetheme.yourtheme.browser.interfaces.IThemeSpecific"
    class="plone.app.layout.viewlets.common.PathBarViewlet"
    permission="zope2.View"
    />


<!-- This is a customization for rendering the a bit different language selector -->
<browser:viewlet
    name="plone.app.i18n.locales.languageselector"
    for="*"
    manager="plonetheme.yourtheme.browser.viewlets.manager.IHeaderBottomViewletManager"
    layer="plonetheme.yourtheme.browser.interfaces.IThemeSpecific"
    class=".selector.LanguageSelector"
    permission="zope2.View"
    />
```

Next, we need to render our viewlet manager somehow.
One place to do it is in a {file}`main_template.pt`, but because we need to add this HTML output to a header section which is produced by _another_ viewlet manager, we need to create a new viewlet just for rendering our viewlet manager.
We put viewlets in your viewlets so you can render viewlets!

In {file}`browser/viewlets/headerbottom.pt`:

```xml
<tal:comment replace="nothing">
  <!-- Render our precious viewlet manager -->
</tal:comment>
<tal:render-manager replace="structure provider:plonetheme.yourtheme.headerbottommanager" />
```

Only six files needed to change a bit of HTML code.
Welcome to the land of productivity!
On top of all this, you also need to create a new {file}`viewlets.xml` export for your theme.

```{seealso}
-   [Tutorial: Overriding Viewlets](https://5.docs.plone.org/develop/plone/views/more_view_examples.html)
```


## Advanced

This section describes how to find and poke viewlets programmatically.


### Finding viewlets programmatically

Occasionally, you may need to get hold of your viewlets in Python code, perhaps in tests.
Since the availability of a viewlet is ultimately controlled by the viewlet manager to which it has been registered, using that manager is a good way to go.

```python
from zope.component import queryMultiAdapter
from zope.viewlet.interfaces import IViewletManager

from Products.Five.browser import BrowserView as View

from my.package.tests.base import MyPackageTestCase

class TestMyViewlet(MyPackageTestCase):
    """ test demonstrates that registration variables worked
    """

    def test_viewlet_is_present(self):
        """ looking up and updating the manager should list our viewlet
        """
        # we need a context and request
        request = self.app.REQUEST
        context = self.portal

        # viewlet managers also require a view object for adaptation
        view = View(context, request)

        # finally, you need the name of the manager you want to find
        manager_name = "plone.portalfooter"

        # viewlet managers are found by Multi-Adapter lookup
        manager = queryMultiAdapter((context, request, view), IViewletManager, manager_name, default=None)
        self.assertIsNotNone(manager)

        # calling update() on a manager causes it to set up its viewlets
        manager.update()

        # now our viewlet should be in the list of viewlets for the manager
        # we can verify this by looking for a viewlet with the name we used
        # to register the viewlet in zcml
        my_viewlet = [v for v in manager.viewlets if v.__name__ == "mypackage.myviewlet"]

        self.assertEqual(len(my_viewlet), 1)
```

Since it is possible to register a viewlet for a specific content type and for a browser layer, you may also need to use these elements in looking up your viewlet.

```python
from zope.component import queryMultiAdapter
from zope.viewlet.interfaces import IViewletManager
from Products.Five.browser import BrowserView as View
from my.package.tests.base import MyPackageTestCase

# this time, we need to add an interface to the request
from zope.interface import alsoProvides

# we also need our content type and browser layer
from my.package.content.mytype import MyType
from my.package.interfaces import IMyBrowserLayer

class TestMyViewlet(MyPackageTestCase):
    """ test demonstrates that zcml registration variables worked properly
    """

    def test_viewlet_is_present(self):
        """ looking up and updating the manager should list our viewlet
        """
        # our viewlet is registered for a browser layer.  Browser layers
        # are applied to the request during traversal in the publisher.  We
        # need to do the same thing manually here
        request = self.app.REQUEST
        alsoProvides(request, IMyBrowserLayer)

        # we also have to make our context an instance of our content type
        content_id = self.folder.invokeFactory("MyType", "my-id")
        context = self.folder[content_id]

        # and that's it.  Everything else from here out is identical to the
        # example above.
```


### Poking viewlet registrations programmatically

The following code is an example of how one can poke the viewlets registration for a Plone site.

```python
from zope.component import getUtility
from plone.app.viewletmanager.interfaces import IViewletSettingsStorage


def fix_tinymce_viewlets(site):
    """
    Make sure TinyMCE viewlet is forced to be in Plone HTML <head> viewletmanager.

    For some reason, running in our viewlets.xml has no effect, so we need to fix this by hand.
    """

    # Poke me like this: for i in storage._hidden["Isle of Back theme"].items(): print i
    storage = getUtility(IViewletSettingsStorage)
    manager = "plone.htmlhead'"
    skinname = site.getCurrentSkinName()

    # Force tinymce.configuration out of hidden viewlets in <head>
    hidden = storage.getHidden(manager, skinname)
    hidden = (x for x in hidden if x != "tinymce.configuration")
    storage.setHidden(manager, skinname, hidden)
```
