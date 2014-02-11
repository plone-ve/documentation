.. contents:: :local:

Maintenance Guide
=================

.. admonition:: Description

   How to maintenance the Plone Documentation.

Introduction
============
This chapter explains the basics of editing, updating and contributing to
the *Plone Documentation*.

Editing documentation on Github
===============================

* You can `commit file edits through GitHub web interface <https://github.com/Plone/documentation>`_ using the **Fork and Edit** button, followed by a pull request.

* Alternatively, clone the repository using *git*, perform changes, and push them to your fork.Then submit a pull request.

The Plone collective GitHub repository has open-for-all contribution
access.
If you want to contribute changes without asking the maintainers to merge
them, please add your GitHub username to your profile on plone.org and
request access `here <http://dev.plone.org/wiki/ContributeCollective>`_.

Some helper tools
=================

**Emacs** has a nice `rst-mode
<http://docutils.sourceforge.net/docs/user/emacs.html>`_. This mode comes
with some Emacs distros. Try ``M-x rst-mode`` in your Emacs and enjoy syntax
coloration, underlining a heading with ``^C ^A``

**Eclipse** users can install **ReST Editor** through the Eclipse
Marketplace.

**Vim** does syntax highlighting for RST files.
There is also a nice plugin with enhanced functionalities called `Riv <https://github.com/Rykka/riv.vim>`_.

**ReText** if you use Ubuntu or Debian you could also use **ReText** a Editor for **.rst** and **.md**

.. code-block:: rst

    apt-get install retext