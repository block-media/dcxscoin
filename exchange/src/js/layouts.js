const sidebar = document.getElementById('side-bar');
sidebar.innerHTML = `
        <div class="nk-sidebar-element nk-sidebar-head">
        <div class="nk-sidebar-brand">
            <a href="./index.html" class="logo-link nk-sidebar-logo">
                <img class="logo-light logo-img" src="./images/logo.png" srcset="./images/logo2x.png 2x"
                    alt="logo">
                <img class="logo-dark logo-img" src="./images/logo-dark.png"
                    srcset="./images/logo-dark2x.png 2x" alt="logo-dark">
            </a>
            <a href="./index.html" class="logo-link nk-sidebar-logo-small">
                <img class="logo-light logo-img" src="./images/logo-small.png"
                    srcset="./images/logo-small2x.png 2x" alt="logo">
                <img class="logo-dark logo-img" src="./images/logo-dark-small.png"
                    srcset="./images/logo-dark-small2x.png 2x" alt="logo-dark">
            </a>
        </div>
        <div class="nk-menu-trigger mr-n2">
            <a href="#" class="nk-nav-toggle nk-quick-nav-icon d-xl-none" data-target="sidebarMenu"><em
                    class="icon ni ni-arrow-left"></em></a>
        </div>
        </div><!-- .nk-sidebar-element -->
        <div class="nk-sidebar-element">
        <div class="nk-sidebar-body" data-simplebar>
            <div class="nk-sidebar-content">
                <div class="nk-sidebar-menu nk-sidebar-menu-middle">
                    <!-- Menu -->
                    <ul class="nk-menu short-menu">
                        <li class="nk-menu-item">
                            <a href="html/index.html" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-notify"></em></span>
                                <span class="nk-menu-text">Overview</span>
                                <span class="nk-menu-tooltip" title="Home"></span>
                            </a>
                        </li>
                        <li class="nk-menu-item">
                            <a href="html/orders" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-globe"></em></span>
                                <span class="nk-menu-text">Orders</span>
                                <span class="nk-menu-tooltip" title="Orders"></span>
                            </a>
                        </li>
                        <li class="nk-menu-item">
                            <a href="html/PositionTrack.html" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-sun"></em></span>
                                <span class="nk-menu-text">Position Tracker</span>
                                <span class="nk-menu-tooltip" title="Position Tracker"></span>
                            </a>
                        </li>
                        <li class="nk-menu-item">
                            <a href="" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-security"></em></span>
                                <span class="nk-menu-text">Bank</span>
                                <span class="nk-menu-tooltip" title="Bank"></span>
                            </a>
                        </li>
                        <li class="nk-menu-item">
                            <a href="html/faqs.html" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-help"></em></span>
                                <span class="nk-menu-text">FAQs</span>
                                <span class="nk-menu-tooltip" title="FAQs"></span>
                            </a>
                        </li>
                        <li class="nk-menu-item">
                            <a href="html/admin.html" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-layers"></em></span>
                                <span class="nk-menu-text">Admin</span>
                                <span class="nk-menu-tooltip" title="Admin"></span>
                            </a>
                        </li>
                    </ul><!-- .nk-menu -->
                </div><!-- .nk-sidebar-menu -->
                <div class="nk-sidebar-footer d-none d-md-block">
                    <ul class="nk-menu short-menu">
                        <li class="nk-menu-item">
                            <a href="#" data-toggle="modal" data-target="#covid-feedback"
                                class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-chat-fill"></em></span>
                                <span class="nk-menu-text">Feedback</span>
                            </a>
                        </li>
                        <li class="nk-menu-item">
                            <a href="#" data-toggle="modal" data-target="#covid-about" class="nk-menu-link">
                                <span class="nk-menu-icon"><em class="icon ni ni-info-fill"></em></span>
                                <span class="nk-menu-text">About Data</span>
                            </a>
                        </li>
                    </ul><!-- .nk-menu -->
                </div><!-- .nk-sidebar-footer -->
            </div><!-- .nk-sidebar-contnet -->
        </div><!-- .nk-sidebar-body -->
        </div><!-- .nk-sidebar-element -->
`