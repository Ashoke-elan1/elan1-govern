/* ==========================================================================
   ACCESS — owner: access
   Sign-in and sign-up (layout 'auth'), the onboarding wizard (layout 'wizard',
   registered here), account pages (layout 'console', no door) and system pages
   (403 · maintenance · offline · outage).
   Sources: spec-im §1.8, §3.2–3.3, §9.1 · spec-phase1-console §1.5, §2.6–2.7,
   §2.9, F13, §7.13–7.19, §7.24 · spec-phase2-3-evidence §1.15, §2.7 D2–D6, F8 ·
   spec-phase4-group §1.13 · spec-tm §1.3, §2.4–2.5, §4.7–4.8.
   Routes: /auth/* · /onboarding · /onboarding/:step · /account/* · /system/*
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc, fmt = E1.fmt;

  /* ------------------------------------------------------------------------
     Styles (tokens only; classes prefixed acc-)
     ------------------------------------------------------------------------ */
  var CSS = [
    /* auth */
    /* v2 auth shell (product sign-in, not a marketing split): paper header strip, form on the canvas, ink facts panel */
    '.acc-shell{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background:var(--bg-canvas)}',
    '.acc-shell__bar{display:flex;align-items:center;gap:14px;height:56px;padding:0 24px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);flex:none}',
    '.acc-shell__bar .e1-logo img{height:28px;width:auto}',
    '.acc-shell__ctx{display:flex;flex-direction:column;min-width:0;padding-left:14px;border-left:1px solid var(--border-subtle);line-height:1.25}',
    '.acc-shell__ctx b{font:var(--weight-semibold) var(--text-body)/1.25 var(--font-ui);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.acc-shell__ctx span{font-size:var(--text-caption);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.acc-shell__sp{flex:1}',
    '.acc-shell__links{display:flex;align-items:center;gap:18px;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.acc-shell__links a{color:var(--text-secondary);text-decoration:none}.acc-shell__links a:hover{color:var(--text-primary);text-decoration:underline}',
    '.acc-shell__links b{color:var(--text-primary);font-weight:var(--weight-medium)}',
    '.acc-shell__body{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:0}',
    '.acc-shell__main{position:relative;display:flex;flex-direction:column;align-items:center;padding:56px 32px 72px;outline:none;min-width:0}',
    '.acc-shell__form{width:100%;max-width:420px}',
    '.acc-shell__form:has(.acc-wide){max-width:560px}',
    '.acc-shell__legal{width:100%;max-width:420px;margin-top:auto;padding-top:32px;display:flex;justify-content:space-between;gap:8px 16px;flex-wrap:wrap;font-size:var(--text-caption);color:var(--text-tertiary)}',
    '.acc-shell__form:has(.acc-wide) + .acc-shell__legal{max-width:560px}',
    '.acc-shell__legal a{color:var(--text-secondary)}',
    '.acc-side{background:var(--bg-chrome);color:var(--text-on-chrome);padding:56px 48px 72px;display:flex;flex-direction:column;gap:28px;min-width:0}',
    '.acc-side__eyebrow{font:var(--weight-semibold) var(--text-label)/var(--lh-label) var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-on-chrome-quiet);margin:0}',
    '.acc-side__line{font:var(--weight-title) 28px/34px var(--font-display);letter-spacing:var(--tracking-title);color:var(--text-on-chrome-strong);margin:10px 0 0;max-width:24ch}',
    '.acc-side__sub{margin:12px 0 0;font-size:var(--text-body);line-height:var(--lh-body);color:var(--text-on-chrome-quiet);max-width:52ch}',
    '.acc-facts{list-style:none;margin:0;padding:0;border-top:1px solid var(--border-chrome)}',
    '.acc-fact{display:grid;grid-template-columns:150px minmax(0,1fr);gap:16px;padding:16px 0;border-bottom:1px solid var(--border-chrome)}',
    '.acc-fact__v{font:var(--weight-semibold) 18px/1.25 var(--font-mono);color:var(--text-on-chrome-strong);font-variant-numeric:tabular-nums}',
    '.acc-fact b{display:block;font-weight:var(--weight-semibold);color:var(--text-on-chrome-strong)}',
    '.acc-fact div span{display:block;margin-top:2px;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-on-chrome-quiet)}',
    '.acc-side__foot{margin-top:auto;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:var(--text-caption);color:var(--text-on-chrome-quiet)}',
    '.acc-side__foot a{color:var(--text-on-chrome)}',
    '.acc-side__lvl{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border:1px solid var(--border-chrome);border-radius:var(--radius-sm);font:var(--weight-medium) 11px/1 var(--font-mono);color:var(--text-on-chrome)}',
    '.acc-side :focus-visible{outline-color:var(--ink-300)}',
    '@media (max-width:1100px){.acc-side{padding:40px 28px}.acc-fact{grid-template-columns:120px minmax(0,1fr)}.acc-fact__v{font-size:16px}}',
    '@media (max-width:860px){.acc-shell__body{grid-template-columns:minmax(0,1fr)}.acc-shell__main{padding:28px 16px 24px;align-items:stretch}.acc-shell__form,.acc-shell__legal{max-width:none}.acc-side{padding:28px 16px 32px;gap:20px}.acc-side__line{font-size:22px;line-height:28px}.acc-shell__bar{padding:0 12px;gap:10px;height:52px}.acc-shell__links .acc-hide-sm{display:none}.acc-shell__ctx span{display:none}}',
    '@media (max-width:420px){.acc-fact{grid-template-columns:minmax(0,1fr);gap:4px}.acc-shell__links{gap:10px}}',
    '.acc-auth__top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:-6px 0 6px}',
    '.acc-auth__top .e1-eyebrow{margin:0}',
    '.acc-auth__title{font:var(--weight-title) var(--text-page-title)/var(--lh-page-title) var(--font-display);letter-spacing:var(--tracking-title);margin:0 0 6px;color:var(--text-primary)}',
    '.acc-auth__lead{color:var(--text-secondary);margin:0 0 20px;font-size:var(--text-body);line-height:var(--lh-body)}',
    '.acc-auth__lead strong{color:var(--text-primary);font-weight:var(--weight-semibold)}',
    '.acc-stack{display:flex;flex-direction:column;gap:14px}',
    '.acc-stack--sm{gap:8px}',
    '.acc-or{display:flex;align-items:center;gap:12px;color:var(--text-tertiary);font-size:var(--text-caption);margin:18px 0}',
    '.acc-or::before,.acc-or::after{content:"";flex:1;height:1px;background:var(--border-subtle)}',
    '.acc-foot{margin-top:22px;padding-top:16px;border-top:1px solid var(--border-subtle);font-size:var(--text-caption);color:var(--text-secondary);display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between}',
    '.acc-foot a,.acc-link{color:var(--text-link);text-decoration:underline;text-underline-offset:2px}',
    '.acc-note{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-sunken);font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.acc-note strong{color:var(--text-primary)}',
    '.acc-note .e1-icon{flex:none;margin-top:1px;color:var(--text-secondary)}',
    '.acc-note[hidden]{display:none}',
    '.acc-note--info{border-color:var(--state-info-border);background:var(--state-info-bg)}',
    '.acc-note--warning{border-color:var(--state-warning-border);background:var(--state-warning-bg)}',
    '.acc-note--good{border-color:var(--state-good-border);background:var(--state-good-bg)}',
    '.acc-note--serious{border-color:var(--state-serious-border);background:var(--state-serious-bg)}',
    '.acc-otp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) 10px repeat(3,minmax(0,1fr));gap:8px;align-items:center}',
    '.acc-otp__sep{height:2px;background:var(--border-default);border-radius:2px}',
    '.acc-otp input{width:100%;min-width:0;height:52px;text-align:center;font:var(--weight-semibold) 22px/1 var(--font-mono);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);color:var(--text-primary);caret-color:var(--text-accent)}',
    '.acc-otp input:focus{outline:none;border-color:var(--focus-ring);box-shadow:var(--focus-shadow)}',
    '.acc-otp.is-invalid input{border-color:var(--state-critical)}',
    '.acc-otpmeta{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.acc-tlist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
    '.acc-trow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);color:inherit;text-decoration:none;transition:border-color var(--dur-fast) var(--ease-out),background var(--dur-fast) var(--ease-out)}',
    '.acc-trow:hover{border-color:var(--border-default);background:var(--bg-hover)}',
    '.acc-trow:focus-visible{outline:none;box-shadow:var(--focus-shadow)}',
    '.acc-trow.is-current{border-color:var(--border-accent);box-shadow:inset 3px 0 0 var(--border-accent)}',
    '.acc-trow__mark{width:38px;height:38px;border-radius:var(--radius-md);background:var(--bg-chrome);color:var(--text-on-chrome);display:grid;place-items:center;font:var(--weight-semibold) 12px/1 var(--font-mono)}',
    '.acc-trow.is-stopped .acc-trow__mark{background:var(--state-serious-bg);color:var(--state-serious);border:1px solid var(--state-serious-border)}',
    '.acc-trow__name{font-weight:var(--weight-semibold);color:var(--text-primary);display:block}',
    '.acc-trow__meta{font-size:var(--text-caption);color:var(--text-secondary);display:flex;flex-wrap:wrap;gap:2px 10px;margin-top:3px}',
    '.acc-trow__stop{display:block;margin-top:4px;font-size:var(--text-caption);color:var(--state-serious)}',
    '.acc-trow__side{display:flex;flex-direction:column;align-items:flex-end;gap:6px}',
    '.acc-bar{height:4px;background:var(--bg-sunken);border-radius:var(--radius-full);overflow:hidden}',
    '.acc-bar i{display:block;height:100%;width:38%;background:var(--text-primary);border-radius:inherit;animation:acc-slide 1.3s var(--ease-in-out) infinite}',
    '@keyframes acc-slide{0%{transform:translateX(-110%)}100%{transform:translateX(280%)}}',
    '.acc-hop{display:flex;align-items:center;gap:12px;padding:16px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-sunken)}',
    '.acc-hop__end{display:flex;flex-direction:column;align-items:center;gap:6px;flex:none;width:92px;text-align:center;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.acc-hop__icon{width:40px;height:40px;border-radius:var(--radius-md);display:grid;place-items:center;background:var(--bg-surface);border:1px solid var(--border-subtle);color:var(--text-primary)}',
    '.acc-hop__mid{flex:1;min-width:0}',
    '.acc-key{font:var(--weight-medium) 13px/1.45 var(--font-mono);padding:12px 14px;background:var(--bg-sunken);border:1px dashed var(--border-default);border-radius:var(--radius-md);word-break:break-all;color:var(--text-primary)}',
    '.acc-codes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 18px;font:var(--weight-medium) 14px/1.6 var(--font-mono);padding:12px 16px;background:var(--bg-sunken);border-radius:var(--radius-md)}',
    '.acc-big{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:var(--bg-sunken);border:1px solid var(--border-subtle);color:var(--text-primary);margin-bottom:16px}',
    '.acc-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;font-size:var(--text-body)}',
    '.acc-list li{display:flex;gap:10px;align-items:flex-start}',
    '.acc-list .e1-icon{flex:none;margin-top:3px;color:var(--text-secondary)}',
    '.acc-kv{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:var(--text-caption);margin:0}',
    '.acc-kv dt{color:var(--text-tertiary)}',
    '.acc-kv dd{margin:0;color:var(--text-primary);overflow-wrap:anywhere}',
    '.acc-invite{display:flex;gap:14px;align-items:center;padding:14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-sunken);margin-bottom:18px}',
    '.acc-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.acc-inline{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    '.acc-methods{display:flex;flex-direction:column;gap:8px}',
    '.acc-method{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center;padding:12px 14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);color:inherit;text-decoration:none}',
    'a.acc-method:hover{background:var(--bg-hover);border-color:var(--border-default)}',
    '.acc-method.is-active{border-color:var(--border-accent);box-shadow:inset 3px 0 0 var(--border-accent)}',
    '.acc-method__icon{width:36px;height:36px;border-radius:var(--radius-md);background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-primary)}',
    '.acc-method__t{font-weight:var(--weight-semibold);display:block}',
    '.acc-method__d{font-size:var(--text-caption);color:var(--text-secondary);display:block}',
    /* wizard layout */
    '.acc-wz{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background:var(--bg-canvas)}',
    '.acc-wz__head{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:16px;height:60px;padding:0 24px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle)}',
    '.acc-wz__title{padding-left:16px;border-left:1px solid var(--border-subtle);display:flex;flex-direction:column;min-width:0;line-height:1.25}',
    '.acc-wz__title b{font-size:var(--text-body);font-weight:var(--weight-semibold);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.acc-wz__title span{font-size:var(--text-caption);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.acc-wz__spacer{flex:1}',
    '.acc-wz__time{font-size:var(--text-caption);color:var(--text-secondary);display:flex;align-items:center;gap:6px;white-space:nowrap}',
    '.acc-wz__body{flex:1;display:grid;grid-template-columns:264px minmax(0,1fr) 320px;align-items:start;width:100%;max-width:1480px;margin:0 auto}',
    '.acc-wz__steps{position:sticky;top:60px;padding:28px 16px 28px 24px;max-height:calc(100vh - 60px);overflow:auto;align-self:start}',
    '.acc-wz__main{padding:32px 40px 0;min-width:0;outline:none}',
    '.acc-wz__main > .acc-step{max-width:760px}',
    '.acc-wz__sum{position:sticky;top:60px;padding:28px 24px 28px 0;max-height:calc(100vh - 60px);overflow:auto;align-self:start}',
    '.acc-wz__mprog{display:none}',
    '.acc-vhead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 8px 12px}',
    '.acc-vtrack{height:3px;border-radius:var(--radius-full);background:var(--border-subtle);margin:0 8px 16px;overflow:hidden}',
    '.acc-vtrack i{display:block;height:100%;background:var(--text-primary);border-radius:inherit;transition:width var(--dur-slow) var(--ease-out)}',
    '.acc-vpre{display:flex;align-items:center;gap:10px;padding:7px 8px;margin-bottom:6px;border-radius:var(--radius-md);color:var(--text-secondary);text-decoration:none;font-size:var(--text-body)}',
    '.acc-vpre:hover{background:var(--bg-hover);color:var(--text-primary)}',
    '.acc-vpre.is-current{background:var(--bg-selected);color:var(--text-primary);font-weight:var(--weight-medium)}',
    '.acc-vsteps{list-style:none;margin:0;padding:0}',
    '.acc-vstep{position:relative}',
    '.acc-vstep a{display:grid;grid-template-columns:24px minmax(0,1fr);gap:10px;align-items:start;padding:7px 8px;border-radius:var(--radius-md);color:var(--text-secondary);text-decoration:none;position:relative}',
    '.acc-vstep a:hover{background:var(--bg-hover);color:var(--text-primary)}',
    '.acc-vstep:not(:last-child)::after{content:"";position:absolute;left:19px;top:33px;height:calc(100% - 28px);width:1.5px;background:var(--border-subtle)}',
    '.acc-vstep--done:not(:last-child)::after{background:var(--text-primary)}',
    '.acc-vstep__n{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;border:1.5px solid var(--border-default);font:var(--weight-semibold) 11px/1 var(--font-mono);background:var(--bg-canvas);color:var(--text-secondary);position:relative;z-index:1}',
    '.acc-vstep--done .acc-vstep__n{background:var(--text-primary);border-color:var(--text-primary);color:var(--text-inverse)}',
    '.acc-vstep--current a{background:var(--bg-selected);color:var(--text-primary)}',
    '.acc-vstep--current .acc-vstep__n{border-color:var(--text-primary);color:var(--text-primary);background:var(--bg-surface)}',
    '.acc-vstep__l{display:block;font-size:var(--text-body);font-weight:var(--weight-medium);line-height:24px}',
    '.acc-vstep__note{display:block;font-size:var(--text-caption);color:var(--text-tertiary);line-height:16px;margin-top:-2px}',
    '.acc-vhelp{margin:20px 8px 0;padding-top:16px;border-top:1px solid var(--border-subtle);font-size:var(--text-caption);color:var(--text-secondary);display:flex;flex-direction:column;gap:8px}',
    '.acc-vhelp a{color:var(--text-link)}',
    '.acc-stepnav{position:sticky;bottom:0;z-index:4;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:14px 0 18px;margin-top:32px;border-top:1px solid var(--border-subtle);background:var(--bg-canvas)}',
    '.acc-stepnav__hint{flex:1;min-width:120px;font-size:var(--text-caption);color:var(--text-tertiary);text-align:right}',
    '.acc-errsum{border:1px solid var(--state-critical-border);background:var(--state-critical-bg);border-radius:var(--radius-md);padding:12px 16px;margin-bottom:20px}',
    '.acc-errsum p{margin:0 0 6px;font-weight:var(--weight-semibold);color:var(--state-critical);display:flex;gap:8px;align-items:center}',
    '.acc-errsum ul{margin:0;padding-left:26px;font-size:var(--text-body)}',
    '.acc-errsum a{color:var(--text-primary);text-decoration:underline}',
    '.acc-sum{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-1);overflow:hidden}',
    '.acc-sum__head{padding:16px;display:flex;gap:14px;align-items:center;border-bottom:1px solid var(--border-subtle)}',
    '.acc-sum__head h2{font:var(--weight-semibold) var(--text-section)/var(--lh-section) var(--font-display);margin:0}',
    '.acc-sum__head p{margin:2px 0 0;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.acc-sum__list{list-style:none;margin:0;padding:6px 0}',
    '.acc-sum__row{display:grid;grid-template-columns:18px minmax(0,1fr);gap:10px;padding:6px 16px}',
    '.acc-sum__row.is-current{background:var(--bg-hover)}',
    '.acc-sum__ic{margin-top:1px;color:var(--text-tertiary)}',
    '.acc-sum__row.is-done .acc-sum__ic{color:var(--state-good)}',
    '.acc-sum__row.is-current .acc-sum__ic{color:var(--text-accent)}',
    '.acc-sum__k{display:block;font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);font-weight:var(--weight-semibold)}',
    '.acc-sum__v{display:block;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-primary);overflow-wrap:anywhere;margin-top:2px}',
    '.acc-sum__v.is-empty{color:var(--text-tertiary)}',
    '.acc-sum__foot{padding:14px 16px;border-top:1px solid var(--border-subtle);background:var(--bg-sunken);font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.acc-sum__foot strong{color:var(--text-primary)}',
    '.acc-opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}',
    '.acc-opts--2{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '.acc-opts--1{grid-template-columns:minmax(0,1fr)}',
    '.acc-opt{position:relative;display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);cursor:pointer;transition:border-color var(--dur-fast) var(--ease-out)}',
    '.acc-opt:hover{border-color:var(--border-default)}',
    '.acc-opt input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}',
    '.acc-opt:has(input:checked){border-color:var(--border-accent);box-shadow:0 0 0 1px var(--border-accent)}',
    '.acc-opt:has(input:focus-visible){box-shadow:var(--focus-shadow)}',
    '.acc-opt.is-disabled{cursor:not-allowed;background:var(--bg-sunken)}',
    '.acc-opt.is-disabled .acc-opt__t{color:var(--text-secondary)}',
    '.acc-opt__top{display:flex;justify-content:space-between;align-items:center;gap:8px}',
    '.acc-opt__t{font-weight:var(--weight-semibold);color:var(--text-primary);display:flex;align-items:center;gap:8px}',
    '.acc-opt__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.acc-opt__radio{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--border-default);flex:none;display:grid;place-items:center}',
    '.acc-opt:has(input:checked) .acc-opt__radio{border-color:var(--border-accent)}',
    '.acc-opt:has(input:checked) .acc-opt__radio::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--brand-clay)}',
    '.acc-opt__foot{margin-top:auto;padding-top:6px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
    '.acc-opt__foot .e1-badge{white-space:normal;height:auto;min-height:22px;text-align:left;max-width:100%}',
    '.acc-panel{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);padding:18px 20px}',
    '.acc-panel + .acc-panel{margin-top:16px}',
    '.acc-panel__h{font:var(--weight-title) var(--text-section)/var(--lh-section) var(--font-display);margin:0 0 4px}',
    '.acc-panel__lead{font-size:var(--text-body);color:var(--text-secondary);margin:0 0 16px}',
    '.acc-fgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 16px}',
    '.acc-fgrid > .is-wide{grid-column:1 / -1}',
    '.acc-mt{margin-top:16px}',
    '.acc-mt-lg{margin-top:24px}',
    '.acc-blocks{list-style:none;margin:0;padding:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface)}',
    '.acc-block{display:grid;grid-template-columns:28px 140px minmax(0,1fr) auto;gap:12px;align-items:baseline;padding:11px 16px;border-top:1px solid var(--border-subtle)}',
    '.acc-block:first-child{border-top:0}',
    '.acc-block__n{font:var(--weight-semibold) 12px/1 var(--font-mono);color:var(--text-tertiary)}',
    '.acc-block__name{font:var(--weight-semibold) 13px/1.3 var(--font-mono);color:var(--text-primary)}',
    '.acc-block__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.acc-sentence{font:var(--weight-regular) var(--text-lead)/var(--lh-lead) var(--font-display);color:var(--text-primary);padding:14px 16px;border-left:3px solid var(--border-accent);background:var(--bg-sunken);border-radius:0 var(--radius-md) var(--radius-md) 0;margin:0 0 16px}',
    '.acc-sentence em{font-style:normal;color:var(--text-accent);font-weight:var(--weight-semibold)}',
    '.acc-gates{list-style:none;margin:0;padding:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.acc-gate{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:12px;align-items:start;padding:12px 16px;border-top:1px solid var(--border-subtle)}',
    '.acc-gate:first-child{border-top:0}',
    '.acc-gate__id{font:var(--weight-semibold) 12px/24px var(--font-mono);color:var(--text-secondary)}',
    '.acc-gate__name{font-weight:var(--weight-semibold);display:block;line-height:24px}',
    '.acc-gate__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary);display:block}',
    '.acc-gate__lock{display:inline-flex;align-items:center;gap:6px;font-size:var(--text-caption);color:var(--text-secondary);white-space:nowrap;height:24px}',
    '.acc-gate__params{grid-column:2 / -1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 12px;margin-top:4px}',
    '.acc-gate.is-off .acc-gate__name{color:var(--text-secondary)}',
    '.acc-run{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);padding:16px 18px}',
    '.acc-run + .acc-run{margin-top:14px}',
    '.acc-run__head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap}',
    '.acc-run__t{font-weight:var(--weight-semibold);display:block;color:var(--text-primary)}',
    '.acc-run__d{font-size:var(--text-caption);color:var(--text-secondary);display:block;margin-top:2px}',
    '.acc-run__res{margin-top:14px;padding-top:12px;border-top:1px dashed var(--border-subtle);display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.acc-run__res b{color:var(--text-primary)}',
    '.acc-run .e1-rung__name{white-space:normal;line-height:1.25}',
    '.acc-run .e1-rung__t{display:flex;flex-direction:column;gap:2px}',
    '.acc-codepanel[hidden]{display:none}',
    '.acc-checks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
    '.acc-check{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;align-items:start;padding:10px 0;border-top:1px solid var(--border-subtle)}',
    '.acc-check:first-child{border-top:0}',
    '.acc-check__t{font-weight:var(--weight-medium);display:block}',
    '.acc-check__d{font-size:var(--text-caption);color:var(--text-secondary);display:block}',
    '.acc-hero{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;padding:28px 28px;border-radius:var(--radius-md);background:var(--bg-chrome);color:var(--text-on-chrome);margin-bottom:24px}',
    '.acc-hero h1{font:var(--weight-bold) var(--text-display)/var(--lh-display) var(--font-display);letter-spacing:var(--tracking-display);color:var(--text-on-chrome-strong);margin:6px 0 10px}',
    '.acc-hero p{color:var(--text-on-chrome-quiet);margin:0;max-width:56ch;font-size:var(--text-lead);line-height:var(--lh-lead);font-weight:var(--weight-light)}',
    '.acc-hero .e1-eyebrow{color:var(--brand-ember)}',
    '.acc-hero__actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}',
    '.acc-needs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--border-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden}',
    '.acc-need{display:grid;grid-template-columns:32px minmax(0,1fr);gap:12px;padding:14px 16px;background:var(--bg-surface)}',
    '.acc-need__i{width:32px;height:32px;border-radius:var(--radius-md);background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-primary)}',
    '.acc-need b{display:block;font-weight:var(--weight-semibold)}',
    '.acc-need span{display:block;font-size:var(--text-caption);color:var(--text-secondary);line-height:var(--lh-caption);margin-top:2px}',
    '.acc-plan{list-style:none;margin:0;padding:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.acc-plan li{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;padding:10px 16px;border-top:1px solid var(--border-subtle);align-items:baseline;font-size:var(--text-body)}',
    '.acc-plan li:first-child{border-top:0}',
    '.acc-plan__n{font:var(--weight-semibold) 12px/1 var(--font-mono);color:var(--text-tertiary)}',
    '.acc-plan__m{font:var(--weight-medium) 12px/1 var(--font-mono);color:var(--text-secondary);white-space:nowrap}',
    '.acc-doors{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}',
    '.acc-door{display:flex;flex-direction:column;gap:8px;padding:16px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);color:inherit;text-decoration:none;transition:border-color var(--dur-fast) var(--ease-out)}',
    '.acc-door:hover{border-color:var(--border-default)}',
    '.acc-door:focus-visible{outline:none;box-shadow:var(--focus-shadow)}',
    '.acc-door b{font:var(--weight-semibold) var(--text-section)/var(--lh-section) var(--font-display)}',
    '.acc-door span{font-size:var(--text-caption);color:var(--text-secondary);line-height:var(--lh-caption)}',
    '.acc-door em{font-style:normal;font-size:var(--text-caption);color:var(--text-link);margin-top:auto}',
    '.acc-people{width:100%}',
    '.acc-addrow{display:grid;grid-template-columns:1.2fr 1.5fr 1fr 1fr auto;gap:8px;align-items:end}',
    '.acc-addrow .e1-field{margin:0}',
    /* account + system */
    '.acc-langs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}',
    '.acc-lang{padding:12px 14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}',
    '.acc-lang.is-active{border-color:var(--border-accent);box-shadow:inset 0 3px 0 var(--border-accent)}',
    '.acc-lang__h{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}',
    '.acc-lang__h b{font-weight:var(--weight-semibold)}',
    '.acc-lang ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:var(--text-body)}',
    '.acc-lang li small{display:block;font-size:var(--text-micro);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary)}',
    '.acc-banner{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;border-radius:var(--radius-md);border:1px solid var(--state-serious-border);background:var(--state-serious-bg);color:var(--text-primary);margin-bottom:20px;font-size:var(--text-body)}',
    '.acc-banner .e1-icon{flex:none;margin-top:2px;color:var(--state-serious)}',
    '.acc-banner b{display:block}',
    '.acc-banner--info{border-color:var(--state-info-border);background:var(--state-info-bg)}',
    '.acc-banner--info .e1-icon{color:var(--state-info)}',
    '.acc-banner--neutral{border-color:var(--state-neutral-border);background:var(--state-neutral-bg)}',
    '.acc-banner--neutral .e1-icon{color:var(--state-neutral)}',
    '.acc-banner__act{margin-left:auto;flex:none}',
    '.e1-table.acc-matrix td,.e1-table.acc-matrix th{text-align:center}',
    '.e1-table.acc-matrix td:first-child,.e1-table.acc-matrix th:first-child{text-align:left}',
    '.acc-sum .e1-arc__v{display:flex;align-items:baseline;justify-content:center;padding-top:20px;font-size:16px}',
    '.acc-banner + .e1-ph{margin-top:8px}',
    '.acc-matrix .e1-choice{justify-content:center}',
    '.acc-matrix .e1-choice__label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}',
    '.acc-cellnote{display:block;font-size:var(--text-micro);color:var(--text-tertiary);margin-top:2px}',
    '.acc-rowlabel b{display:block;font-weight:var(--weight-medium)}',
    '.acc-rowlabel span{display:block;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.acc-sys{max-width:760px}',
    '.acc-sys__code{font:var(--weight-semibold) 12px/1 var(--font-mono);letter-spacing:var(--tracking-label);color:var(--text-tertiary);text-transform:uppercase}',
    '.acc-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}',
    '.acc-muted-row td{color:var(--text-secondary)}',
    /* responsive */
    '@media (max-width:1240px){.acc-wz__body{grid-template-columns:240px minmax(0,1fr)}.acc-wz__steps{grid-row:span 2}.acc-wz__sum{grid-column:2;position:static;max-height:none;padding:8px 40px 40px}.acc-wz__main > .acc-step{max-width:none}}',
    '@media (max-width:1100px){.acc-doors{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@media (max-width:860px){.acc-wz__head{padding:0 16px;height:56px;gap:10px}.acc-wz__title{padding-left:10px}.acc-wz__time,.acc-wz__env,.acc-wz__theme{display:none}.acc-wz__body{display:block}.acc-wz__steps{display:none}.acc-wz__mprog{display:block;padding:14px 16px 0}.acc-wz__main{padding:16px 16px 0}.acc-wz__sum{padding:8px 16px 32px}.acc-hero{grid-template-columns:1fr;padding:22px 18px}.acc-hero h1{font-size:28px;line-height:32px}.acc-hero__disc{display:none}.acc-needs,.acc-fgrid,.acc-two,.acc-opts--2{grid-template-columns:minmax(0,1fr)}.acc-block{grid-template-columns:24px minmax(0,1fr);}.acc-block__d,.acc-block > :last-child{grid-column:2}.acc-addrow{grid-template-columns:1fr}.acc-gate__params{grid-template-columns:1fr}.acc-langs{grid-template-columns:1fr}.acc-stepnav__hint{display:none}}',
    '@media (max-width:560px){.acc-doors{grid-template-columns:1fr}.acc-otp{gap:5px;grid-template-columns:repeat(3,minmax(0,1fr)) 6px repeat(3,minmax(0,1fr))}.acc-otp input{height:48px;font-size:20px}.acc-trow{grid-template-columns:auto minmax(0,1fr)}.acc-trow__side{grid-column:1 / -1;flex-direction:row;align-items:center;justify-content:space-between}.acc-codes{grid-template-columns:1fr}}',
    '.acc-mprog__row{display:flex;justify-content:space-between;gap:8px;font-size:var(--text-caption);color:var(--text-secondary);margin-bottom:6px}',
    '.acc-mprog__row b{color:var(--text-primary)}',
    '@media (prefers-reduced-motion:reduce){.acc-bar i{animation:none;width:100%}.acc-vtrack i{transition:none}}'
  ].join('\n');
  (function injectCss() {
    if (document.getElementById('acc-style')) return;
    var s = document.createElement('style'); s.id = 'acc-style'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  })();

  /* ------------------------------------------------------------------------
     Sample data (canonical names from spec-phase1-console §4)
     ------------------------------------------------------------------------ */
  var RESOLVER_SETS = [
    { id: 'ar-approvers', label: 'ar-approvers', what: 'Approve sales invoices, credit notes and credit-limit changes' },
    { id: 'ap-approvers', label: 'ap-approvers', what: 'Approve supplier bills, purchase orders and payment runs' },
    { id: 'owners', label: 'owners', what: 'Second approver under dual control; may request a stop' },
    { id: 'none', label: 'No resolver set', what: 'May propose; may not approve' }
  ];

  E1.data.access = {
    ssoDomains: {
      'deccanauto.in': { idp: 'Okta', protocol: 'SAML 2.0', tenant: 'deccan-auto', icon: 'building' },
      'sahyadriagro.in': { idp: 'Google Workspace', protocol: 'OIDC', tenant: 'sahyadri-agro', icon: 'building' },
      'ledgerloop.io': { idp: 'Microsoft Entra ID', protocol: 'OIDC', tenant: 'ledgerloop-sbx', icon: 'building' }
    },
    memberships: {
      'kaveri-spinning': { role: 'Accounts head', sets: ['ar-approvers'], last: E1.ago(26) },
      'deccan-auto': { role: 'Viewer · group finance', sets: [], last: E1.ago(60 * 24 * 3) },
      'sahyadri-agro': { role: 'Setup lead', sets: [], last: E1.ago(60 * 5) },
      'nilgiri-tea': { role: 'Approver', sets: ['ar-approvers'], last: E1.ago(60 * 26) },
      'ledgerloop-sbx': { role: 'Design-partner liaison', sets: [], last: E1.ago(60 * 24 * 6) },
      'ref-tenant': { role: 'Conformance runner', sets: [], last: E1.ago(60 * 24 * 12) }
    },
    approvable: [
      { wt: 'erp.sales_invoice.submit', label: 'Submit invoice', radius: 2, dual: 'Above ₹2,00,000', rev: '24 h' },
      { wt: 'erp.credit_note.submit', label: 'Raise credit note', radius: 2, dual: 'Always', rev: 'Compensating entry' },
      { wt: 'erp.credit_limit.change', label: 'Change credit limit', radius: 2, dual: 'Always', rev: '30 days' }
    ],
    sponsored: [
      { id: 'ar-agent', name: 'ar-agent', model: 'claude-sonnet (via rung1)', grant: 'A2', wt: 'erp.sales_invoice.submit' },
      { id: 'rung1-drafting-agent', name: 'rung1 drafting agent', model: 'claude-haiku', grant: 'A2', wt: 'erp.sales_invoice.submit' },
      { id: 'gst-agent', name: 'gst-agent', model: 'sarvam-m', grant: 'A1', wt: 'erp.gstr1.file' }
    ],
    sessions: [
      { id: 's-this', device: 'Chrome 128 on macOS', kind: 'Web console', method: 'Passkey (Touch ID)', where: 'Tiruppur, Tamil Nadu', started: E1.ago(95), last: E1.ago(0), current: true, icon: 'grid' },
      { id: 's-pwa', device: 'Safari on iPhone 15', kind: 'Mobile PWA', method: 'Passkey (Face ID)', where: 'Tiruppur, Tamil Nadu', started: E1.ago(60 * 20), last: E1.ago(130), icon: 'phone' },
      { id: 's-wa', device: 'WhatsApp deep link → Safari', kind: 'Approval deep link', method: 'Console session required', where: 'Coimbatore, Tamil Nadu', started: E1.ago(60 * 3), last: E1.ago(60 * 3), note: 'Ends 24 h after the message', icon: 'message' },
      { id: 's-office', device: 'Edge 127 on Windows 11', kind: 'Web console', method: 'E-mail code + authenticator app', where: 'Tiruppur office network', started: E1.ago(60 * 24 * 2), last: E1.ago(60 * 24 * 2 - 300), icon: 'grid' }
    ],
    activity: [
      { at: E1.ago(95), title: 'Signed in with a passkey', body: 'Chrome 128 on macOS · Tiruppur. Phishing-resistant, so no second step was asked.', state: 'good' },
      { at: E1.ago(60 * 3), title: 'Opened an approval from WhatsApp', body: 'OB-2026-0409 deep link. Sign-in was required before the diff was shown.', state: 'info' },
      { at: E1.ago(60 * 26), title: 'Re-authenticated before approving', body: 'Idle for 17 minutes. Approve asks again after 15 minutes idle.', state: 'neutral' },
      { at: E1.ago(60 * 24 * 2), title: 'Signed in with an e-mail code and authenticator app', body: 'Edge 127 on Windows 11 · Tiruppur office network.', state: 'good' },
      { at: E1.ago(60 * 24 * 9), title: 'Sign-in refused: wrong authenticator code three times', body: 'Chrome on Android · Chennai. The account was not locked; the attempt is kept in the security log for a year.', state: 'serious' }
    ],
    events: [
      { id: 'raised', label: 'Waiting on you', note: 'An obligation names you or your resolver set', def: { console: true, email: true, whatsapp: true, push: true }, lock: { console: true } },
      { id: 'expiry', label: 'Near expiry', note: '60 minutes before an obligation you can resolve expires', def: { console: true, email: false, whatsapp: true, push: true } },
      { id: 'outcome', label: 'Outcome of something you proposed', note: 'Committed, Not done, or Waiting on a person', def: { console: true, email: true, whatsapp: false, push: false } },
      { id: 'expired', label: 'Expired without a decision', note: 'Nobody decided in time; the proposer can resubmit', def: { console: true, email: true, whatsapp: false, push: false } },
      { id: 'stop', label: 'Tenant stopped or restarted', note: 'Always sent. Writes are paused for this organisation', def: { console: true, email: true, whatsapp: true, push: true }, lock: { console: true, email: true } },
      { id: 'incident', label: 'Platform incident', note: 'Always sent. Approval deadlines pause while we fix it', def: { console: true, email: true, whatsapp: false, push: true }, lock: { console: true, email: true } },
      { id: 'chain', label: 'Chain standing changed', note: 'Continuous · break detected · not checked', def: { console: true, email: true, whatsapp: false, push: false } },
      { id: 'certified', label: 'Declaration certified', note: 'A new version your approvals will render from', def: { console: true, email: false, whatsapp: false, push: false } },
      { id: 'deprecation', label: 'Deprecation notice', note: 'An integration you sponsor uses a deprecated version', def: { console: true, email: true, whatsapp: false, push: false } }
    ],
    channels: [
      { id: 'console', label: 'In console', note: 'Bell, top bar' },
      { id: 'email', label: 'E-mail', note: 'Notice and deep link' },
      { id: 'whatsapp', label: 'WhatsApp', note: 'Opt-in · consent ledger' },
      { id: 'push', label: 'Mobile PWA', note: 'Push to your phone' }
    ]
  };
  var A = E1.data.access;

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  function hx(seed, n) {
    var str = String(seed || 'x'), out = '', b = 0;
    while (out.length < n) {
      var h = (2166136261 ^ (b * 374761393)) >>> 0;
      for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; h ^= h >>> 13; }
      h = Math.imul(h ^ (h >>> 16), 2246822507) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0; h = (h ^ (h >>> 16)) >>> 0;
      out += ('00000000' + h.toString(16)).slice(-8); b++;
    }
    return out.slice(0, n);
  }
  function q(v) { return v === undefined || v === null ? '' : String(v); }
  function here() { return '#' + E1.state.route.path; }
  function hereQ(extra) { var qq = {}, cur = E1.state.route.query || {}; Object.keys(cur).forEach(function (k) { qq[k] = cur[k]; }); Object.keys(extra || {}).forEach(function (k) { qq[k] = extra[k]; }); return E1.href(E1.state.route.path, qq); }
  function val(id) { var el = document.getElementById(id); return el ? String(el.value || '').trim() : null; }
  function checked(id) { var el = document.getElementById(id); return el ? !!el.checked : null; }
  function radio(name) { var el = document.querySelector('#e1-main input[name="' + name + '"]:checked'); return el ? el.value : null; }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var LIST_RE = /^(accounts?|finance|team|info|admin|support|billing|ops|hello|contact|office|all|group|noreply|no-reply)[@.+_-]/i;
  var AGENT_RE = /(^|[-_.\s])(agent|bot|automation|service|svc)([-_.@\s]|$)/i;
  var GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  var ADR_RE = /^ADR-[0-9]{4}$/;
  function statesMenu(items) {
    return c.menu({ label: 'View states', icon: 'layers', kind: 'ghost', size: 'sm', align: 'right', items: items.map(function (it) { return { label: it[0], href: it[1], note: it[2] }; }) });
  }
  function person(name) { var p = (E1.data.people || []).filter(function (x) { return x.name === name; })[0]; return p; }
  function reducedMotion() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }

  /* ------------------------------------------------------------------------
     The 'auth' layout, restyled for v2 (only access.js and the layout preview use it).
     A product sign-in: a thin header strip that names the surface, the form on the
     canvas, and an ink panel of facts about how signing in works. No page-scale disc.
     ------------------------------------------------------------------------ */
  var AUTH_FACTS = [
    ['0 passwords', 'Nothing to remember or leak', 'Sign in with an e-mail code, a passkey or your organisation’s single sign-on.'],
    ['15 min', 'Then an approval asks again', 'Approving changes the books, so after 15 idle minutes it needs one fresh passkey touch.'],
    ['12 h', 'Then an idle session ends', 'Nothing you were deciding is submitted; the obligation keeps its original deadline.'],
    ['1 tenant', 'Per session, from your token', 'The tenant is never typed. Switching tenants re-issues the session.']
  ];
  E1.layouts.auth = function (content, def, title) {
    var t = E1.tenant ? E1.tenant() : {};
    var site = E1.hasRoute('/') ? '#/' : '#/auth/sign-in';
    return '<div class="e1-app acc-shell">' +
      '<header class="acc-shell__bar" role="banner"><button type="button" class="e1-skip" data-action="skip">Skip to content</button>' + E1.logo('auto', site) +
        '<div class="acc-shell__ctx"><b>' + esc(def.authLabel || title || 'Sign in') + '</b><span>elan1 Console · developer portal · auditor access</span></div><span class="acc-shell__sp"></span>' +
        '<nav class="acc-shell__links" aria-label="Sign-in links">' + (E1.hasRoute('/') ? '<a class="acc-hide-sm" href="#/">Back to the elan1 site</a>' : '') +
          '<span class="acc-hide-sm">New here? <a href="#/auth/sign-up"><b>Get a sandbox key</b></a></span>' +
          '<button type="button" class="e1-iconbtn" data-action="theme" aria-label="' + (E1.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') + '">' + c.icon(E1.state.theme === 'dark' ? 'sun' : 'moon', 18) + '</button></nav></header>' +
      '<div class="acc-shell__body">' +
        '<main class="acc-shell__main" id="e1-main" tabindex="-1"><div class="acc-shell__form">' + content + '</div>' +
          '<p class="acc-shell__legal"><span>Data stays in India · ' + esc(t.region || 'Mumbai') + '</span><span><a href="#/security">How we handle sign-in data</a></span></p></main>' +
        '<aside class="acc-side" aria-label="How signing in works"><div><p class="acc-side__eyebrow">elan1 Console · sign-in</p>' +
          '<p class="acc-side__line">The agent drafts it. You commit it.</p>' +
          '<p class="acc-side__sub">A session lets you read and decide. Each approval is still a separate step, recorded against your name and kept in the chain.</p></div>' +
          '<ul class="acc-facts" role="list">' + AUTH_FACTS.map(function (f) { return '<li class="acc-fact"><span class="acc-fact__v">' + esc(f[0]) + '</span><div><b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></div></li>'; }).join('') + '</ul>' +
          '<div class="acc-side__foot"><span class="acc-side__lvl">L1 Guarded</span><span>Every write hash-chained, not signed</span><a href="#/status">Service status</a><a href="#/security/subprocessors">Sub-processors</a></div></aside>' +
      '</div></div>';
  };

  /* ========================================================================
     AUTH (layout 'auth')
     ======================================================================== */
  function authPage(o) {
    return '<div class="acc-auth' + (o.wide ? ' acc-wide' : '') + '">' +
      '<div class="acc-auth__top">' + (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '<span></span>') + (o.states ? statesMenu(o.states) : '') + '</div>' +
      (o.icon ? '<div class="acc-big" aria-hidden="true">' + c.icon(o.icon, 24) + '</div>' : '') +
      '<h1 class="acc-auth__title">' + esc(o.title) + '</h1>' +
      (o.lead ? '<p class="acc-auth__lead">' + o.lead + '</p>' : '') + (o.body || '') +
      (o.foot ? '<div class="acc-foot">' + o.foot + '</div>' : '') + '</div>';
  }
  function discover(email) {
    var dom = String(email || '').split('@')[1];
    return dom ? A.ssoDomains[dom.toLowerCase()] || null : null;
  }
  function emailOf(qy) { return qy.email || E1.data.user.email; }
  function legalFoot() {
    return '<span>By continuing you accept the <a href="#/legal/terms">terms</a> and the <a href="#/legal/privacy">privacy notice</a>.</span>';
  }

  /* ---- Sign in ----------------------------------------------------------- */
  E1.route('/auth/sign-in', {
    title: 'Sign in', layout: 'auth', keywords: 'login sso passkey saml oidc',
    render: function (p, qy) {
      var st = qy.state || '', email = qy.email || E1.data.user.email, mode = qy.mode || 'email';
      var states = [['Default', '#/auth/sign-in'], ['Single sign-on', '#/auth/sign-in?mode=sso', 'SAML / OIDC domain discovery'], ['Domain uses SSO', '#/auth/sign-in?email=priya.kulkarni%40deccanauto.in', 'Discovered from the e-mail'], ['No account', '#/auth/sign-in?state=unknown'], ['Too many attempts', '#/auth/sign-in?state=locked'], ['Passkey cancelled', '#/auth/sign-in?state=passkey']];
      var alert = '';
      if (st === 'unknown') alert = '<div class="acc-note acc-note--warning" role="alert">' + c.icon('info', 16) + '<span><strong>We could not find an elan1 account for this e-mail.</strong> Ask the person who runs your tenant for an invitation, or get a sandbox key to try elan1 on synthetic data.</span></div>';
      if (st === 'locked') alert = '<div class="acc-note acc-note--serious" role="alert">' + c.icon('clock', 16) + '<span><strong>Too many codes were requested for this e-mail.</strong> Try again in 15 minutes. Nothing about your account has changed; the attempts are kept in the security log.</span></div>';
      if (st === 'passkey') alert = '<div class="acc-note" role="status">' + c.icon('fingerprint', 16) + '<span><strong>The passkey prompt was closed.</strong> Nothing was sent. Try again, or continue with your e-mail.</span></div>';
      var d = discover(email);
      var body;
      if (mode === 'sso') {
        body = '<form class="acc-stack" data-acc-form="sso" novalidate>' + alert +
          c.field('Work domain', c.input({ id: 'acc-domain', value: qy.domain || 'deccanauto.in', mono: true, placeholder: 'yourcompany.in', attrs: 'autocomplete="off"' }), { id: 'acc-domain', help: 'We look up which identity provider your organisation uses. SAML 2.0 and OIDC are supported.' }) +
          c.button('Continue to your identity provider', { kind: 'primary', type: 'submit', full: true, size: 'lg', iconRight: 'arrow-right' }) +
          '</form><div class="acc-or">or</div>' +
          c.button('Use your e-mail instead', { kind: 'secondary', full: true, href: '#/auth/sign-in', icon: 'mail' });
      } else {
        body = '<form class="acc-stack" data-acc-form="signin" novalidate>' + alert +
          c.field('Work e-mail', c.input({ id: 'acc-email', type: 'email', value: email, placeholder: 'name@company.in', attrs: 'autocomplete="username webauthn" inputmode="email"', describedBy: 'acc-email-msg' }), { id: 'acc-email', help: 'We send a six-digit code. There is no password to remember or leak.' }) +
          '<div class="acc-note acc-note--info" id="acc-discover" role="status"' + (d ? '' : ' hidden') + '>' + c.icon('building', 16) + '<span id="acc-discover-t">' + (d ? '<strong>' + esc(email.split('@')[1]) + ' signs in with ' + esc(d.idp) + '</strong> (' + esc(d.protocol) + '). You will go there next; elan1 never sees that password.' : '') + '</span></div>' +
          c.button(d ? 'Continue with ' + d.idp : 'Continue', { kind: 'primary', type: 'submit', full: true, size: 'lg', attrs: 'id="acc-signin-go"' }) +
          '</form>' +
          '<div class="acc-or">or</div>' +
          '<div class="acc-stack acc-stack--sm">' +
          c.button('Sign in with a passkey', { kind: 'secondary', full: true, icon: 'fingerprint', attrs: 'data-action="acc-passkey" data-value="/auth/select-tenant"' }) +
          c.button('Single sign-on (SAML or OIDC)', { kind: 'secondary', full: true, icon: 'building', href: '#/auth/sign-in?mode=sso' }) + '</div>';
      }
      return authPage({
        eyebrow: 'elan1 console', title: 'Sign in to elan1', states: states,
        lead: 'Use your work e-mail. The tenant you work in is chosen after sign-in, from your token, and is never typed.',
        body: body,
        foot: '<span><a href="#/auth/forgot">Cannot get in?</a></span><span>New to elan1? <a href="#/auth/sign-up">Get a sandbox key</a></span>'
      });
    },
    mount: function (el) {
      var inp = el.querySelector('#acc-email');
      if (inp) {
        inp.addEventListener('input', function () {
          var d = discover(inp.value), box = el.querySelector('#acc-discover'), go = el.querySelector('#acc-signin-go span:last-child') || el.querySelector('#acc-signin-go span');
          if (box) { box.hidden = !d; el.querySelector('#acc-discover-t').innerHTML = d ? '<strong>' + esc(inp.value.split('@')[1]) + ' signs in with ' + esc(d.idp) + '</strong> (' + esc(d.protocol) + '). You will go there next; elan1 never sees that password.' : ''; }
          if (go) go.textContent = d ? 'Continue with ' + d.idp : 'Continue';
        });
      }
    }
  });

  function fieldError(el, id, msg) {
    var f = el.querySelector('#' + id); if (!f) return;
    var wrap = f.closest('.e1-field'); if (!wrap) return;
    var old = wrap.querySelector('.e1-field__error'); if (old) old.remove();
    var help = wrap.querySelector('.e1-field__help');
    if (!msg) { wrap.classList.remove('is-invalid'); f.removeAttribute('aria-invalid'); if (help) help.hidden = false; return; }
    wrap.classList.add('is-invalid'); f.setAttribute('aria-invalid', 'true');
    if (help) help.hidden = true;
    var p = document.createElement('p'); p.className = 'e1-field__error'; p.id = id + '-msg'; p.setAttribute('role', 'alert');
    p.innerHTML = c.icon('alert', 12) + '<span>' + esc(msg) + '</span>';
    wrap.appendChild(p); f.setAttribute('aria-describedby', id + '-msg'); f.focus();
  }

  E1.on('submit', 'form[data-acc-form]', function (e, form) {
    e.preventDefault();
    var kind = form.getAttribute('data-acc-form'), main = document.getElementById('e1-main');
    if (kind === 'signin') {
      var email = val('acc-email');
      if (!EMAIL_RE.test(email)) return fieldError(main, 'acc-email', 'Enter a work e-mail like name@company.in.');
      var d = discover(email);
      if (d) return E1.go('/auth/sso', { email: email });
      return E1.go('/auth/verify', { email: email });
    }
    if (kind === 'sso') {
      var dom = (val('acc-domain') || '').toLowerCase().replace(/^.*@/, '');
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(dom)) return fieldError(main, 'acc-domain', 'Enter a domain like yourcompany.in.');
      if (!A.ssoDomains[dom]) return fieldError(main, 'acc-domain', dom + ' has no single sign-on set up with elan1. Use your e-mail instead, or ask your administrator.');
      return E1.go('/auth/sso', { email: 'you@' + dom });
    }
    if (kind === 'verify' || kind === 'mfa') {
      var boxes = form.querySelectorAll('.acc-otp input'), code = Array.prototype.map.call(boxes, function (b) { return b.value; }).join('');
      var otp = form.querySelector('.acc-otp'), msg = form.querySelector('.acc-otp-msg');
      if (!/^[0-9]{6}$/.test(code)) { otp.classList.add('is-invalid'); msg.innerHTML = c.icon('alert', 12) + '<span>Enter all six digits.</span>'; msg.hidden = false; boxes[Math.min(code.length, 5)].focus(); return; }
      if (code === '000000') { otp.classList.add('is-invalid'); msg.innerHTML = c.icon('alert', 12) + '<span>That code does not match. 4 attempts left before we ask you to wait 15 minutes.</span>'; msg.hidden = false; boxes[0].select(); return; }
      var qy = E1.state.route.query || {};
      if (kind === 'verify') return E1.go('/auth/mfa', { email: qy.email, invite: qy.invite });
      E1.toast('Signed in as ' + E1.data.user.name + '.', 'good');
      return E1.go('/auth/select-tenant', qy.invite ? { joined: 'kaveri-spinning' } : null);
    }
    if (kind === 'backup') {
      var bc = (val('acc-backup') || '').toUpperCase();
      if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(bc)) return fieldError(main, 'acc-backup', 'A backup code looks like 7KQ2-M4XD: eight characters with a hyphen.');
      E1.toast('Backup code accepted. 7 of 10 codes are left; make new ones from your profile.', 'warning', { title: 'Signed in with a backup code' });
      return E1.go('/auth/select-tenant');
    }
    if (kind === 'signup') {
      var em = val('acc-su-email'), co = val('acc-su-company'), de = val('acc-su-desc'), ok = checked('acc-su-terms'), bad = false;
      ['acc-su-email', 'acc-su-company', 'acc-su-desc'].forEach(function (id) { fieldError(main, id, ''); });
      if (!ok) { var t = main.querySelector('#acc-su-terms-msg'); if (t) t.hidden = false; bad = true; }
      if (de.length < 12) { fieldError(main, 'acc-su-desc', 'An honest sentence, please: at least 12 characters about what the agent will change.'); bad = true; }
      if (co.length < 2) { fieldError(main, 'acc-su-company', 'Enter the company the sandbox tenant is for.'); bad = true; }
      if (!EMAIL_RE.test(em)) { fieldError(main, 'acc-su-email', 'Enter a work e-mail like name@company.in.'); bad = true; }
      else if (LIST_RE.test(em)) { fieldError(main, 'acc-su-email', 'Give us a person, not a distribution list. The key goes to one named human.'); bad = true; }
      if (bad) return;
      return E1.go('/auth/check-email', { for: 'sandbox', email: em });
    }
    if (kind === 'forgot') {
      var fe = val('acc-fg-email');
      if (!EMAIL_RE.test(fe)) return fieldError(main, 'acc-fg-email', 'Enter the e-mail you sign in with.');
      return E1.go('/auth/check-email', { for: 'recovery', email: fe });
    }
  });

  E1.action('acc-passkey', function (el) {
    var to = el.getAttribute('data-value') || '/auth/select-tenant';
    E1.toast('Touch the sensor or use your phone when your browser asks.', 'info', { title: 'Waiting for your passkey', timeout: 1400 });
    el.classList.add('is-loading'); el.setAttribute('aria-busy', 'true');
    setTimeout(function () { E1.toast('Passkey accepted. A passkey is phishing-resistant, so no second step is needed.', 'good', { title: 'Signed in' }); E1.go(to); }, 1100);
  });

  /* ---- SSO interstitial --------------------------------------------------- */
  E1.route('/auth/sso', {
    title: 'Single sign-on', layout: 'auth', keywords: 'saml oidc identity provider redirect',
    render: function (p, qy) {
      var email = qy.email || 'priya.kulkarni@deccanauto.in', dom = email.split('@')[1] || 'deccanauto.in';
      var d = A.ssoDomains[dom] || A.ssoDomains['deccanauto.in'];
      var st = qy.state;
      var states = [['Redirecting', '#/auth/sso?email=priya.kulkarni%40deccanauto.in'], ['OIDC provider', '#/auth/sso?email=anand.kulkarni%40sahyadriagro.in'], ['Provider refused', '#/auth/sso?state=error'], ['Not assigned to the app', '#/auth/sso?state=unassigned']];
      if (st === 'error' || st === 'unassigned') {
        return authPage({
          eyebrow: 'Single sign-on', title: st === 'error' ? 'Your identity provider did not sign you in' : 'You are not assigned to elan1 in ' + d.idp, states: states, icon: 'building',
          lead: st === 'error' ? esc(d.idp) + ' returned without an assertion for elan1. Nothing was created or changed on our side.' : 'Your organisation uses ' + esc(d.idp) + ', and the elan1 application has not been assigned to your account there. Your IT administrator can assign it.',
          body: c.error({ title: st === 'error' ? 'No assertion received' : 'Application not assigned', body: st === 'error' ? 'Protocol ' + d.protocol + '. Response status: Responder / AuthnFailed.' : 'The identity provider answered, but your account is not in the group that may use elan1.', reassurance: 'No session was opened and no approval was recorded.', code: st === 'error' ? (d.protocol === 'OIDC' ? 'error=access_denied' : 'StatusCode Responder / AuthnFailed') + ' · ' + dom : 'Not assigned · ' + dom }) +
            '<div class="acc-stack acc-mt">' + c.button('Try again', { kind: 'primary', full: true, href: E1.href('/auth/sso', { email: email }) }) + c.button('Back to sign-in', { kind: 'ghost', full: true, href: '#/auth/sign-in' }) + '</div>'
        });
      }
      return authPage({
        eyebrow: 'Single sign-on · ' + d.protocol, title: 'Taking you to ' + d.idp, states: states,
        lead: '<strong>' + esc(dom) + '</strong> signs in through ' + esc(d.idp) + '. Sign in there and you will come straight back. elan1 never sees your password.',
        body: '<div class="acc-hop" aria-hidden="true"><div class="acc-hop__end"><span class="acc-hop__icon">' + c.icon('lock', 18) + '</span>elan1</div>' +
          '<div class="acc-hop__mid"><div class="acc-bar"><i></i></div></div>' +
          '<div class="acc-hop__end"><span class="acc-hop__icon">' + c.icon('building', 18) + '</span>' + esc(d.idp) + '</div></div>' +
          '<dl class="acc-kv acc-mt"><dt>Account</dt><dd class="e1-mono">' + esc(email) + '</dd><dt>Protocol</dt><dd>' + esc(d.protocol) + (d.protocol === 'OIDC' ? ' · authorisation code with PKCE' : ' · signed assertion, SP-initiated') + '</dd><dt>We ask for</dt><dd>Your name, e-mail and group membership. Nothing else.</dd><dt>Second factor</dt><dd>' + esc(d.idp) + ' enforces it; we check that it did (amr includes mfa).</dd></dl>' +
          '<div class="acc-stack acc-mt">' + c.button('Continue to ' + d.idp, { kind: 'primary', full: true, size: 'lg', iconRight: 'external', attrs: 'data-action="acc-sso-return" data-value="' + esc(d.tenant) + '"' }) +
          c.button('Use a different account', { kind: 'ghost', full: true, href: '#/auth/sign-in' }) + '</div>',
        foot: '<span>Your administrator set this up in ' + esc(d.idp) + '.</span><a href="#/auth/sign-in?mode=sso">Enter a different domain</a>'
      });
    }
  });
  E1.action('acc-sso-return', function (el) {
    el.classList.add('is-loading');
    setTimeout(function () { E1.toast('Signed in through single sign-on. Your identity provider asserted a second factor.', 'good', { title: 'Welcome back' }); E1.go('/auth/select-tenant'); }, 900);
  });

  /* ---- OTP boxes (verify + MFA) ------------------------------------------ */
  function otpBoxes(label) {
    var ins = '';
    for (var i = 0; i < 6; i++) {
      ins += (i === 3 ? '<span class="acc-otp__sep" aria-hidden="true"></span>' : '') +
        '<input inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="' + (i === 0 ? 'one-time-code' : 'off') + '" aria-label="' + esc(label) + ', digit ' + (i + 1) + ' of 6">';
    }
    return '<fieldset style="border:0;margin:0;padding:0;min-width:0"><legend class="e1-field__label" style="margin-bottom:8px">' + esc(label) + '</legend><div class="acc-otp" data-otp>' + ins + '</div>' +
      '<p class="e1-field__error acc-otp-msg" role="alert" hidden></p></fieldset>';
  }
  E1.on('input', '[data-otp] input', function (e, inp) {
    var wrap = inp.closest('[data-otp]'), boxes = Array.prototype.slice.call(wrap.querySelectorAll('input'));
    var v = inp.value.replace(/\D/g, '');
    wrap.classList.remove('is-invalid'); var msg = wrap.parentNode.querySelector('.acc-otp-msg'); if (msg) msg.hidden = true;
    if (v.length > 1) { // pasted or autofilled
      var i0 = boxes.indexOf(inp);
      v.split('').slice(0, 6 - i0).forEach(function (ch, k) { boxes[i0 + k].value = ch; });
      var nxt = boxes[Math.min(i0 + v.length, 5)]; nxt.focus();
    } else {
      inp.value = v;
      if (v && boxes.indexOf(inp) < 5) boxes[boxes.indexOf(inp) + 1].focus();
    }
    if (boxes.every(function (b) { return b.value; })) { var f = wrap.closest('form'); if (f && f.requestSubmit) f.requestSubmit(); }
  });
  E1.on('keydown', '[data-otp] input', function (e, inp) {
    var boxes = Array.prototype.slice.call(inp.closest('[data-otp]').querySelectorAll('input')), i = boxes.indexOf(inp);
    if (e.key === 'Backspace' && !inp.value && i > 0) { boxes[i - 1].focus(); boxes[i - 1].value = ''; e.preventDefault(); }
    if (e.key === 'ArrowLeft' && i > 0) { boxes[i - 1].focus(); e.preventDefault(); }
    if (e.key === 'ArrowRight' && i < 5) { boxes[i + 1].focus(); e.preventDefault(); }
  });

  var resendTimer = null;
  function startResend(el, secs) {
    var b = el.querySelector('#acc-resend'), t = el.querySelector('#acc-resend-t');
    if (!b) return;
    if (resendTimer) clearInterval(resendTimer);
    var left = secs;
    b.disabled = true;
    function paint() { t.textContent = left > 0 ? 'Send a new code in 0:' + ('0' + left).slice(-2) : ''; b.disabled = left > 0; }
    paint();
    resendTimer = setInterval(function () {
      if (!document.body.contains(b)) { clearInterval(resendTimer); return; }
      left--; paint(); if (left <= 0) clearInterval(resendTimer);
    }, 1000);
  }

  /* ---- Verify (magic link / one-time code) ------------------------------ */
  E1.route('/auth/verify', {
    title: 'Enter your code', layout: 'auth', keywords: 'otp one-time code magic link',
    render: function (p, qy) {
      var email = emailOf(qy), st = qy.state;
      var states = [['Waiting for the code', '#/auth/verify'], ['Code expired', '#/auth/verify?state=expired'], ['Link opened on another device', '#/auth/verify?state=other-device']];
      if (st === 'expired') {
        return authPage({ eyebrow: 'Step 1 of 2 · e-mail', title: 'That code has expired', icon: 'timer', states: states,
          lead: 'Codes and links last 10 minutes and work once. Nothing was signed in with the old one.',
          body: '<div class="acc-stack">' + c.button('Send a new code to ' + email, { kind: 'primary', full: true, href: E1.href('/auth/verify', { email: email }) }) + c.button('Use a different e-mail', { kind: 'ghost', full: true, href: '#/auth/sign-in' }) + '</div>' });
      }
      if (st === 'other-device') {
        return authPage({ eyebrow: 'Step 1 of 2 · e-mail', title: 'The link was opened on another device', icon: 'phone', states: states,
          lead: 'A sign-in link was opened on <strong>Safari on iPhone</strong> in Tiruppur at ' + esc(fmt.time(E1.ago(1))) + '. Was that you?',
          body: '<div class="acc-stack">' + c.button('Yes, sign in here instead', { kind: 'primary', full: true, href: E1.href('/auth/mfa', { email: email }) }) + c.button('No, that was not me', { kind: 'secondary', full: true, attrs: 'data-action="acc-not-me"' }) + '</div>' +
            '<p class="e1-caption e1-muted acc-mt">If it was not you, the link stops working at once and your tenant owner is told.</p>' });
      }
      return authPage({
        eyebrow: 'Step 1 of 2 · e-mail', title: 'Check your e-mail', states: states,
        lead: 'We sent a six-digit code and a sign-in link to <strong>' + esc(email) + '</strong>. Either works once, for 10 minutes.',
        body: '<form class="acc-stack" data-acc-form="verify" novalidate>' + otpBoxes('Six-digit code') +
          '<div class="acc-otpmeta"><span id="acc-resend-t" aria-live="polite"></span><button type="button" class="e1-btn e1-btn--ghost e1-btn--sm" id="acc-resend" data-action="acc-resend">' + c.icon('refresh', 14) + '<span>Send a new code</span></button></div>' +
          c.button('Verify and continue', { kind: 'primary', type: 'submit', full: true, size: 'lg' }) + '</form>' +
          '<div class="acc-note acc-mt">' + c.icon('info', 16) + '<span>Not in your inbox? Check spam for <strong>no-reply@elan1.ai</strong>. Codes come only from that address, and we never ask for a code by phone or WhatsApp.</span></div>',
        foot: '<a href="#/auth/sign-in">Use a different e-mail</a><a href="' + esc(E1.href('/auth/check-email', { for: 'sign-in', email: email })) + '">I will use the link instead</a>'
      });
    },
    mount: function (el) {
      setTimeout(function () { var first = el.querySelector('[data-otp] input'); if (first) first.focus(); }, 0);
      startResend(el, 30);
    }
  });
  E1.action('acc-resend', function () {
    E1.toast('A new code is on its way. The old one no longer works.', 'info');
    startResend(document.getElementById('e1-main'), 30);
  });
  E1.action('acc-not-me', function () {
    E1.toast('The link was cancelled and Meenakshi Iyer (tenant owner) has been told. Nothing was signed in.', 'warning', { title: 'Link cancelled' });
    E1.go('/auth/signed-out', { reason: 'not-me' });
  });

  /* ---- MFA ---------------------------------------------------------------- */
  E1.route('/auth/mfa', {
    title: 'Second step', layout: 'auth', keywords: 'mfa totp authenticator passkey backup code',
    render: function (p, qy) {
      var m = qy.method || 'totp';
      var methods = [
        { id: 'totp', icon: 'clock', t: 'Authenticator app', d: 'Six digits from Google Authenticator, Microsoft Authenticator or 1Password' },
        { id: 'passkey', icon: 'fingerprint', t: 'Passkey', d: 'Touch ID, Face ID, Windows Hello or a security key' },
        { id: 'backup', icon: 'key', t: 'Backup code', d: 'One of the ten codes you saved. Each works once' }
      ];
      var tabs = '<div class="acc-methods" role="list">' + methods.map(function (x) {
        var on = x.id === m;
        return '<a role="listitem" class="acc-method' + (on ? ' is-active' : '') + '" href="' + esc(E1.href('/auth/mfa', { method: x.id, email: qy.email, invite: qy.invite })) + '"' + (on ? ' aria-current="true"' : '') + '><span class="acc-method__icon">' + c.icon(x.icon, 18) + '</span><span><span class="acc-method__t">' + esc(x.t) + '</span><span class="acc-method__d">' + esc(x.d) + '</span></span>' + (on ? c.icon('check', 16) : c.icon('chevron-right', 16)) + '</a>';
      }).join('') + '</div>';
      var form;
      if (m === 'passkey') form = '<div class="acc-stack acc-mt">' + c.button('Use my passkey', { kind: 'primary', full: true, size: 'lg', icon: 'fingerprint', attrs: 'data-action="acc-passkey" data-value="/auth/select-tenant"' }) + '<p class="e1-caption e1-muted">Your browser will ask. We receive a signature, never your fingerprint or face.</p></div>';
      else if (m === 'backup') form = '<form class="acc-stack acc-mt" data-acc-form="backup" novalidate>' + c.field('Backup code', c.input({ id: 'acc-backup', mono: true, placeholder: '7KQ2-M4XD', attrs: 'autocomplete="off" autocapitalize="characters"' }), { id: 'acc-backup', help: 'Using one leaves the others working. Make new ones from your profile afterwards.' }) + c.button('Verify and continue', { kind: 'primary', type: 'submit', full: true, size: 'lg' }) + '</form>';
      else form = '<form class="acc-stack acc-mt" data-acc-form="mfa" novalidate>' + otpBoxes('Code from your authenticator app') + c.button('Verify and continue', { kind: 'primary', type: 'submit', full: true, size: 'lg' }) + '</form>';
      return authPage({
        eyebrow: 'Step 2 of 2 · second factor', title: 'Confirm it is you',
        lead: 'You approve changes to books of account, so every sign-in needs a second step. Choose one.',
        states: [['Authenticator app', '#/auth/mfa'], ['Passkey', '#/auth/mfa?method=passkey'], ['Backup code', '#/auth/mfa?method=backup']],
        body: tabs + form,
        foot: '<a href="' + esc(E1.href('/auth/forgot', { reason: 'factor' })) + '">Lost your phone or security key?</a><a href="#/auth/sign-in">Start again</a>'
      });
    },
    mount: function (el) { setTimeout(function () { var f = el.querySelector('[data-otp] input'); if (f) f.focus(); }, 0); }
  });

  /* ---- Sign up for a sandbox (E09 Flow 1; D2) --------------------------- */
  E1.route('/auth/sign-up', {
    title: 'Get a sandbox key', layout: 'auth', keywords: 'register sandbox key developer sign up',
    render: function (p, qy) {
      if (qy.state === 'blocked') {
        return authPage({ eyebrow: 'Sandbox key', title: 'We cannot issue a key to this account', icon: 'lock',
          states: [['Form', '#/auth/sign-up'], ['Blocked', '#/auth/sign-up?state=blocked']],
          lead: 'We cannot issue a key to this account. Write to support and a person will read it.',
          body: '<div class="acc-stack">' + c.button('Write to support', { kind: 'primary', full: true, href: '#/contact', icon: 'mail' }) + c.button('Back to sign-in', { kind: 'ghost', full: true, href: '#/auth/sign-in' }) + '</div>' });
      }
      return authPage({
        eyebrow: 'Developers · self-serve', title: 'Get a sandbox key', wide: true,
        states: [['Form', '#/auth/sign-up'], ['Blocked', '#/auth/sign-up?state=blocked']],
        lead: 'A sandbox tenant with synthetic fixtures, ready in under a minute. Its chain is marked <strong>mode: sandbox</strong> in every entry and every meter event is quantity zero, so nothing here is billed.',
        body: '<form class="acc-stack" data-acc-form="signup" novalidate>' +
          '<div class="acc-fgrid">' +
          c.field('Work e-mail', c.input({ id: 'acc-su-email', type: 'email', placeholder: 'name@company.in', value: qy.email || '', attrs: 'autocomplete="email"' }), { id: 'acc-su-email', required: true, help: 'The key goes to one named person.' }) +
          c.field('Company', c.input({ id: 'acc-su-company', placeholder: 'LedgerLoop Software Pvt Ltd', attrs: 'autocomplete="organization"' }), { id: 'acc-su-company', required: true, help: 'Becomes the sandbox tenant name.' }) +
          '<div class="is-wide">' + c.field('What do you intend to govern?', c.input({ id: 'acc-su-desc', placeholder: 'Our billing agent posts sales invoices to ERPNext for 40 clients' }), { id: 'acc-su-desc', required: true, help: 'One line. It helps the person who later reviews your production request.' }) + '</div></div>' +
          '<div>' + c.checkbox({ id: 'acc-su-terms', label: 'I accept the pre-GA terms for sandbox use', note: 'Sandbox data is synthetic. Do not load real customer records.' }) + '<p class="e1-field__error" id="acc-su-terms-msg" role="alert" hidden>' + c.icon('alert', 12) + '<span>Accept the pre-GA terms to get a key.</span></p></div>' +
          '<dl class="acc-kv"><dt>Limits</dt><dd class="e1-mono">10 writes a minute · 2 concurrent · 5,000 a month, then a hard stop</dd><dt>Provisioning</dt><dd>Under 60 seconds; the p95 is published on the status page</dd><dt>Production</dt><dd>Not self-serve. A person reviews every production request.</dd></dl>' +
          c.button('E-mail me the key', { kind: 'primary', type: 'submit', full: true, size: 'lg', icon: 'mail' }) + '</form>',
        foot: '<span>Already have an account? <a href="#/auth/sign-in">Sign in</a></span><a href="#/developers/sandbox-key">How sandbox keys work</a>'
      });
    }
  });

  /* ---- Check e-mail ------------------------------------------------------- */
  E1.route('/auth/check-email', {
    title: 'Check your e-mail', layout: 'auth', keywords: 'magic link sent',
    render: function (p, qy) {
      var f = qy.for || 'sandbox', email = qy.email || (f === 'sandbox' ? 'priya.nair@ledgerloop.io' : E1.data.user.email);
      var copy = {
        sandbox: ['Check your e-mail. The key is on the other side of the link.', 'We sent a link to <strong>' + esc(email) + '</strong>. It works once, for 30 minutes. Opening it shows your sandbox key once.', 'Open the link'],
        'sign-in': ['Check your e-mail', 'We sent a sign-in link to <strong>' + esc(email) + '</strong>. Open it on this device; it works once, for 10 minutes.', 'Open the link'],
        recovery: ['Check your e-mail', 'If <strong>' + esc(email) + '</strong> has an elan1 account, the recovery steps are on their way. They work once, for 30 minutes.', 'Open the recovery link']
      }[f] || [];
      return authPage({
        eyebrow: f === 'sandbox' ? 'Sandbox key · step 2 of 3' : f === 'recovery' ? 'Account recovery' : 'Sign-in link', title: copy[0], icon: 'mail',
        states: [['Sandbox key', '#/auth/check-email?for=sandbox'], ['Sign-in link', '#/auth/check-email?for=sign-in'], ['Recovery', '#/auth/check-email?for=recovery']],
        lead: copy[1],
        body: '<div class="acc-stack">' + c.button(copy[2], { kind: 'primary', full: true, size: 'lg', attrs: 'data-action="acc-open-link" data-value="' + esc(f) + '"' }) +
          c.button('Send it again', { kind: 'secondary', full: true, icon: 'refresh', attrs: 'data-action="acc-resend-link"' }) + '</div>' +
          '<div class="acc-note acc-mt">' + c.icon('info', 16) + '<span>Links come only from <strong>no-reply@elan1.ai</strong>. The e-mail names the device and city that asked for it.</span></div>',
        foot: f === 'sandbox' ? '<a href="#/auth/sign-up">Use a different e-mail</a><a href="#/developers/quickstart">Read the quickstart meanwhile</a>' : '<a href="#/auth/sign-in">Back to sign-in</a><span></span>'
      });
    }
  });
  E1.action('acc-resend-link', function () { E1.toast('Sent again. Only the newest link works.', 'info'); });
  E1.action('acc-open-link', function (el) {
    var f = el.getAttribute('data-value');
    if (f === 'sign-in') return E1.go('/auth/mfa');
    if (f === 'recovery') return E1.go('/auth/mfa', { method: 'backup' });
    var key = 'sk_sbx_' + hx('ledgerloop' + Date.now(), 32);
    E1.modal({
      eyebrow: 'Sandbox key · shown once', title: 'Your sandbox tenant is ready', size: 'md',
      body: '<p>Your sandbox tenant is ready. Its chain is marked <em>sandbox</em> in every entry, every meter event is quantity zero, and nothing here is billed. Limits: 10 writes a minute, 2 concurrent.</p>' +
        '<div class="acc-key acc-mt" id="acc-sbx-key">' + esc(key) + '</div>' +
        '<p class="e1-caption e1-muted" style="margin-top:8px">We will not show this again. Store it where your code reads secrets; exchange it for short-lived tenant tokens.</p>' +
        '<dl class="acc-kv acc-mt"><dt>Tenant</dt><dd>Sandbox tenant · synthetic fixtures · residency in (Mumbai)</dd><dt>Provisioned in</dt><dd class="e1-mono">38 s</dd><dt>Quota</dt><dd class="e1-mono">10/min · 2 concurrent · 5,000/month</dd></dl>',
      actions: [
        { label: 'Copy key', icon: 'copy', kind: 'secondary', close: false, onClick: function () { E1.copy(key, 'Sandbox key'); return false; } },
        { label: 'Continue to setup', kind: 'primary', onClick: function () { E1.go('/onboarding'); } }
      ]
    });
  });

  /* ---- Invitation --------------------------------------------------------- */
  E1.route('/auth/invite/:token', {
    title: 'Accept invitation', layout: 'auth', example: '/auth/invite/inv-7Q2M-K4XD', keywords: 'invite join tenant resolver set',
    render: function (p, qy) {
      var tok = p.token || '';
      var states = [['Valid invitation', '#/auth/invite/inv-7Q2M-K4XD'], ['Expired', '#/auth/invite/inv-expired'], ['Already accepted', '#/auth/invite/inv-used'], ['Sahyadri setup invite', '#/auth/invite/inv-SAH-2P9L']];
      var sah = /SAH/i.test(tok);
      var t = E1.data.tenants.filter(function (x) { return x.id === (sah ? 'sahyadri-agro' : 'kaveri-spinning'); })[0];
      if (/expired/i.test(tok)) {
        return authPage({ eyebrow: 'Invitation', title: 'This invitation has expired', icon: 'timer', states: states,
          lead: 'Invitations last 7 days. This one was sent by <strong>Meenakshi Iyer</strong> on ' + esc(fmt.date(E1.ago(60 * 24 * 9))) + '. Nothing was set up for you.',
          body: '<div class="acc-stack">' + c.button('Ask Meenakshi Iyer to send a new one', { kind: 'primary', full: true, attrs: 'data-action="acc-ask-reinvite"' }) + c.button('Sign in with an existing account', { kind: 'ghost', full: true, href: '#/auth/sign-in' }) + '</div>' });
      }
      if (/used/i.test(tok)) {
        return authPage({ eyebrow: 'Invitation', title: 'You have already joined', icon: 'check', states: states,
          lead: 'This invitation was accepted on ' + esc(fmt.dateTime(E1.ago(60 * 30))) + '. Each invitation works once.',
          body: c.button('Sign in', { kind: 'primary', full: true, size: 'lg', href: '#/auth/sign-in' }) });
      }
      var inviter = sah ? { name: 'Anand Kulkarni', role: 'Finance controller, Sahyadri Agro Foods' } : { name: 'Meenakshi Iyer', role: 'Owner, Kaveri Spinning Mills' };
      var role = sah ? 'Accounts head' : 'Accounts head';
      var sets = sah ? ['ar-approvers'] : ['ar-approvers'];
      var email = sah ? 'shalini.deshmukh@sahyadriagro.in' : E1.data.user.email;
      return authPage({
        eyebrow: 'Invitation', title: 'Join ' + t.name, wide: true, states: states,
        lead: '<strong>' + esc(inviter.name) + '</strong> (' + esc(inviter.role) + ') invited <strong>' + esc(email) + '</strong> to approve changes in this tenant. Here is exactly what you would be able to do.',
        body: '<div class="acc-invite">' + c.avatar(inviter.name, { kind: 'person', size: 'lg' }) + '<div style="min-width:0"><div class="e1-strong">' + esc(t.name) + '</div><div class="e1-caption e1-muted">' + esc(t.city) + ' · GSTIN <span class="e1-mono">' + esc(t.gstin || '—') + '</span></div>' +
          '<div class="acc-chips" style="margin-top:6px">' + c.badge('neutral', 'Residency ' + t.residency, { icon: 'map-pin', subtle: true }) + c.level(t.level) + c.badge(t.env === 'sandbox' ? 'info' : 'neutral', t.env === 'sandbox' ? 'Sandbox tenant' : 'Production', { subtle: true }) + '</div></div></div>' +
          c.kv([
            ['Your role', role],
            ['Resolver sets you will join', '<div class="acc-chips">' + sets.map(function (s) { return c.chip(s, { icon: 'users' }); }).join('') + '</div>', { html: true }],
            ['You may approve', '<ul class="acc-list">' + A.approvable.map(function (w) { return '<li>' + c.icon('gate', 14) + '<span><strong>' + esc(w.label) + '</strong> <span class="e1-mono e1-caption e1-muted">' + esc(w.wt) + '</span><br><span class="e1-caption e1-muted">Dual control: ' + esc(w.dual) + '</span></span></li>'; }).join('') + '</ul>', { html: true }],
            ['You may not', 'Approve anything you proposed. Change autonomy grants. Stop the tenant.'],
            ['Invited', fmt.dateTime(E1.ago(60 * 20)) + ' · expires in 6 days']
          ]) +
          '<div class="acc-note acc-mt">' + c.icon('users', 16) + '<span>Resolver sets contain humans only. Accepting records you, by name, as a person who may decide these writes. It is itself recorded.</span></div>' +
          '<div class="acc-inline acc-mt">' + c.button('Accept and set up sign-in', { kind: 'primary', size: 'lg', href: E1.href('/auth/verify', { email: email, invite: tok }) }) + c.button('Decline', { kind: 'ghost', attrs: 'data-action="acc-decline"' }) + '</div>',
        foot: '<span>Not expecting this? <a href="#/contact">Tell us</a>.</span><a href="#/auth/sign-in">I already have an account</a>'
      });
    }
  });
  E1.action('acc-ask-reinvite', function () { E1.toast('Meenakshi Iyer has been asked to send a new invitation.', 'info'); });
  E1.action('acc-decline', function () {
    E1.confirm({ title: 'Decline this invitation?', body: '<p>Meenakshi Iyer will be told you declined. Nothing is created for you, and the invitation stops working.</p>', confirmLabel: 'Decline invitation', kind: 'danger',
      onConfirm: function () { E1.toast('Invitation declined. Meenakshi Iyer has been told.', 'neutral'); E1.go('/auth/signed-out', { reason: 'declined' }); } });
  });

  /* ---- Select tenant ------------------------------------------------------ */
  var STATUS = { live: ['good', 'Live'], onboarding: ['info', 'Onboarding'], stopped: ['serious', 'Stopped'], 'pre-ga': ['neutral', 'Pre-GA'], reference: ['neutral', 'Reference'] };
  E1.route('/auth/select-tenant', {
    title: 'Choose a tenant', layout: 'auth', keywords: 'workspace tenant picker switch',
    render: function (p, qy) {
      var ts = E1.data.tenants || [];
      if (qy.state === 'empty') ts = [];
      var cur = E1.state.tenant;
      var list = ts.length ? '<ul class="acc-tlist" role="list">' + ts.map(function (t) {
        var m = A.memberships[t.id] || { role: 'Member', sets: [] }, s = STATUS[t.status] || ['neutral', t.statusNote || t.status];
        var to = t.status === 'onboarding' ? '#/onboarding' : '#/work/today';
        return '<li><a class="acc-trow' + (t.id === cur ? ' is-current' : '') + (t.status === 'stopped' ? ' is-stopped' : '') + '" href="' + to + '" data-action="acc-pick-tenant" data-value="' + esc(t.id) + '">' +
          '<span class="acc-trow__mark" aria-hidden="true">' + esc(t.short) + '</span>' +
          '<span style="min-width:0"><span class="acc-trow__name">' + esc(t.name) + '</span>' +
          '<span class="acc-trow__meta"><span>' + esc(m.role) + (m.sets.length ? ' · ' + esc(m.sets.join(', ')) : '') + '</span><span>' + c.icon('map-pin', 12) + ' ' + esc(t.residency) + '</span><span>' + esc(t.pack) + '</span></span>' +
          (t.status === 'stopped' && t.stop ? '<span class="acc-trow__stop">' + c.icon('stop', 12) + ' Writes are paused for this organisation · ' + esc(t.stop.reason.toLowerCase()) + ' · ' + esc(fmt.dateTime(t.stop.at)) + '</span>' : '') + '</span>' +
          '<span class="acc-trow__side">' + c.badge(s[0], s[1], { subtle: true }) + '<span class="acc-inline">' + c.level(t.level, { short: true }) + '<span class="e1-caption e1-muted">' + (t.env === 'sandbox' ? 'Sandbox' : 'Production') + '</span></span></span></a></li>';
      }).join('') + '</ul>'
        : c.empty({ title: 'You are not a member of any tenant yet', why: 'You signed in, but nobody has invited you and you have no sandbox tenant.', fill: 'Ask your tenant owner for an invitation, or get a sandbox key to try elan1 on synthetic data.', action: [{ label: 'Get a sandbox key', href: '#/auth/sign-up' }, { label: 'Sign out', href: '#/auth/signed-out', kind: 'ghost' }], icon: 'building' });
      return authPage({
        eyebrow: 'Signed in as ' + E1.data.user.name, title: 'Choose a tenant', wide: true,
        states: [['Your tenants', '#/auth/select-tenant'], ['Just joined', '#/auth/select-tenant?joined=kaveri-spinning'], ['No tenants', '#/auth/select-tenant?state=empty']],
        lead: 'Each tenant has its own chain, keys and residency. Switching re-issues your session for that tenant; lists never mix tenants.',
        body: (qy.joined ? '<div class="acc-note acc-note--good" role="status" style="margin-bottom:14px">' + c.icon('check', 16) + '<span><strong>You joined Kaveri Spinning Mills Pvt Ltd</strong> as Accounts head in ar-approvers. Meenakshi Iyer has been told.</span></div>' : '') + list,
        foot: '<span>Signed in as <span class="e1-mono">' + esc(E1.data.user.email) + '</span></span><a href="#/auth/signed-out">Sign out</a>'
      });
    }
  });
  E1.action('acc-pick-tenant', function (el) {
    var id = el.getAttribute('data-value'), t = (E1.data.tenants || []).filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    function go() {
      E1.set('tenant', id, { silent: true });
      E1.toast('Session re-issued for ' + t.name + '.', 'good', { title: 'Tenant: ' + t.short });
      E1.go(t.status === 'onboarding' ? '/onboarding' : '/work/today');
    }
    if (t.status === 'stopped') {
      E1.confirm({ eyebrow: 'Tenant stopped', title: 'Open ' + t.name + '?', kind: 'primary', confirmLabel: 'Open to read',
        body: '<p><strong>Writes are paused for this organisation.</strong> ' + esc(t.stop ? t.stop.reason : '') + ', stopped ' + esc(t.stop ? fmt.dateTime(t.stop.at) : '') + ' by ' + esc(t.stop ? t.stop.by.join(' and ') : '') + '.</p><p>You can read records, proofs and exports. No write is recorded, including refusals, until two people lift the stop.</p>',
        onConfirm: go });
      return;
    }
    go();
  });

  /* ---- Signed out · session expired · forgot ---------------------------- */
  E1.route('/auth/signed-out', {
    title: 'Signed out', layout: 'auth', keywords: 'logout',
    render: function (p, qy) {
      var r = qy.reason;
      var lead = r === 'all' ? 'You signed out of every device, including the mobile app and any WhatsApp deep-link session.' :
        r === 'declined' ? 'You declined the invitation. Nothing was created for you.' :
        r === 'not-me' ? 'We cancelled the sign-in link and told your tenant owner. If you did not ask for a link, nothing else is needed from you.' :
        'You are signed out of elan1 on this device. Your other sessions keep working.';
      return authPage({ eyebrow: 'Session ended', title: r === 'all' ? 'Signed out everywhere' : 'You are signed out', icon: 'log-out',
        states: [['This device', '#/auth/signed-out'], ['All devices', '#/auth/signed-out?reason=all'], ['Invitation declined', '#/auth/signed-out?reason=declined']],
        lead: lead,
        body: '<div class="acc-note" style="margin-bottom:16px">' + c.icon('gate', 16) + '<span>Signing out does not approve, reject or pause anything. Obligations waiting on you keep their deadlines, and your resolver set can still decide them.</span></div>' +
          '<div class="acc-stack">' + c.button('Sign in again', { kind: 'primary', full: true, size: 'lg', href: '#/auth/sign-in' }) + c.button('Go to elan1.ai', { kind: 'ghost', full: true, href: '#/' }) + '</div>' });
    }
  });

  E1.route('/auth/session-expired', {
    title: 'Session ended', layout: 'auth', keywords: 'timeout idle expired',
    render: function (p, qy) {
      var ret = qy.return || '/work/decide/OB-2026-0412';
      var m = E1.match(ret), label = m && m.def ? (typeof m.def.title === 'function' ? m.def.title(m.params, {}) : m.def.title) : 'where you were';
      var approve = qy.reason === 'approve';
      return authPage({ eyebrow: approve ? 'Re-authenticate to approve' : 'Session ended', title: approve ? 'Confirm it is you before approving' : 'Your session ended', icon: approve ? 'gate' : 'timer',
        states: [['Idle 12 hours', '#/auth/session-expired'], ['Approve after 15 min idle', '#/auth/session-expired?reason=approve']],
        lead: approve ? 'You were idle for more than 15 minutes. Approving changes the books, so we ask again. It takes one touch with your passkey.' : 'Sessions end after 12 hours of inactivity. Anything you were deciding was <strong>not</strong> submitted; the obligation is still waiting, with its original deadline.',
        body: '<div class="acc-note" style="margin-bottom:16px">' + c.icon('arrow-right', 16) + '<span>After signing in you return to <strong>' + esc(label) + '</strong> <span class="e1-mono">' + esc(ret) + '</span>. The diff is reloaded, so you see its current state.</span></div>' +
          '<div class="acc-stack">' + c.button('Continue with a passkey', { kind: 'primary', full: true, size: 'lg', icon: 'fingerprint', attrs: 'data-action="acc-passkey" data-value="' + esc(ret) + '"' }) +
          c.button('Use an e-mail code', { kind: 'secondary', full: true, href: E1.href('/auth/verify', { email: E1.data.user.email }) }) + '</div>' });
    }
  });

  E1.route('/auth/forgot', {
    title: 'Recover access', layout: 'auth', keywords: 'forgot lost passkey recovery reset',
    render: function (p, qy) {
      return authPage({ eyebrow: 'Account recovery', title: 'Cannot get in?', states: [['Recover access', '#/auth/forgot'], ['Lost second factor', '#/auth/forgot?reason=factor']],
        lead: qy.reason === 'factor' ? 'Lost your phone or security key? Use a backup code, or ask your tenant owner to reset your second factor.' : 'There is no password to reset. Pick what you lost.',
        body: '<div class="acc-methods">' +
          '<a class="acc-method" href="#/auth/sign-in"><span class="acc-method__icon">' + c.icon('mail', 18) + '</span><span><span class="acc-method__t">I cannot find the code e-mail</span><span class="acc-method__d">Send a new code. Codes last 10 minutes.</span></span>' + c.icon('chevron-right', 16) + '</a>' +
          '<a class="acc-method" href="#/auth/mfa?method=backup"><span class="acc-method__icon">' + c.icon('key', 18) + '</span><span><span class="acc-method__t">I lost my authenticator or passkey</span><span class="acc-method__d">Use one of your ten backup codes.</span></span>' + c.icon('chevron-right', 16) + '</a>' +
          '<a class="acc-method" href="#/auth/sign-in?mode=sso"><span class="acc-method__icon">' + c.icon('building', 18) + '</span><span><span class="acc-method__t">My company uses single sign-on</span><span class="acc-method__d">Recovery happens with your identity provider, not with us.</span></span>' + c.icon('chevron-right', 16) + '</a></div>' +
          '<form class="acc-stack acc-mt-lg" data-acc-form="forgot" novalidate><p class="e1-label">No backup codes either?</p>' +
          c.field('Your e-mail', c.input({ id: 'acc-fg-email', type: 'email', value: qy.email || '', placeholder: 'name@company.in' }), { id: 'acc-fg-email', help: 'We e-mail you, and ask your tenant owner to confirm who you are. A second-factor reset is recorded in the security log and you are told by e-mail.' }) +
          c.button('Start a reset', { kind: 'secondary', type: 'submit', full: true }) + '</form>',
        foot: '<a href="#/auth/sign-in">Back to sign-in</a><a href="#/contact">Talk to a person</a>' });
    }
  });

  /* ========================================================================
     ONBOARDING WIZARD (layout 'wizard', registered here)
     ======================================================================== */
  var STEPS = [
    { id: 'organisation', label: 'Organisation', note: 'Legal entity and owner', min: 3 },
    { id: 'residency', label: 'Residency', note: 'India · Mumbai', min: 2 },
    { id: 'system', label: 'System of record', note: 'Connect ERPNext', min: 8 },
    { id: 'pack', label: 'Pack', note: 'ledger1 · invoice1 · collect1', min: 2 },
    { id: 'declaration', label: 'Declaration', note: 'Seven blocks', min: 10 },
    { id: 'gates', label: 'Gates', note: 'Six never skippable', min: 3 },
    { id: 'people', label: 'People', note: 'Approvers, humans only', min: 5 },
    { id: 'agents', label: 'First agent', note: 'SDK or MCP', min: 8 },
    { id: 'sandbox-proof', label: 'Sandbox proof', note: 'Three outcomes', min: 5 },
    { id: 'production', label: 'Production key', note: 'Reviewed by a person', min: 4 },
    { id: 'done', label: 'Done', note: 'What happens next', min: 1 }
  ];
  function stepIdx(id) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i; return -1; }

  var PACKS = {
    ledger1: { name: 'ledger1', t: 'Books of account audit trail', status: 'Building · first pack', ob: 'MCA Companies (Accounts) Rules, Rule 3(1) audit trail and edit log; Rule 11(g) auditor reporting.', not: 'Changes made directly in ERPNext are ERPNext’s own audit trail and are not in the bundle; the two must be reconciled.', decl: 'erp.ar' },
    invoice1: { name: 'invoice1', t: 'GST e-invoicing', status: 'Specification · second pack', ob: 'GST e-invoicing: governs the write that requests an IRN, mandatory above ₹5 crore turnover.', not: 'The IRN, the portal response and the 24-hour cancellation window are ERPNext’s evidence and not elan1’s.', decl: 'erp.ar' },
    collect1: { name: 'collect1', t: 'Collections conduct', status: 'Spec sketch — rule citations need counsel confirmation before anything ships', ob: 'RBI fair-practice recovery conduct, telecom rules, DPDP and the lender’s board policy.', not: 'Not a funded pack. Nothing ships from it until counsel confirms the citations.', decl: 'erp.collections' },
    none: { name: 'No pack', t: 'Author your own declaration', status: 'Always available', ob: 'You write the seven blocks in the Studio. Gates and proof fields are still enforced.', not: 'No verifier profile or regime mapping comes with it.', decl: 'erp.custom' }
  };
  var SYSTEMS = [
    { id: 'erpnext', t: 'ERPNext (hosted)', d: 'Frappe’s own API. The kernel holds the credential.', live: true, icon: 'server' },
    { id: 'tally', t: 'Tally', d: 'Later. The kernel must hold the credential, and there is no adapter yet.', icon: 'server' },
    { id: 'zoho', t: 'Zoho Books', d: 'Later. No adapter yet; we will say when that changes.', icon: 'cloud' },
    { id: 'odoo', t: 'Odoo', d: 'Later. No adapter yet; we will say when that changes.', icon: 'server' }
  ];
  var MODES = {
    custody: { t: 'Enforced · credential custody', d: 'The kernel holds the ERPNext API credential; your agents never see it.', say: 'This write could not have occurred without passing the gates.' },
    token: { t: 'Enforced · token acceptance', d: 'ERPNext accepts only kernel-minted tokens that expire in 10 minutes.', say: 'This write could not have occurred without passing the gates.' },
    advisory: { t: 'Attested advisory', d: 'Your code holds the credential and calls elan1 first. Promotion to Enforced needs 30 days of traffic and a review.', say: 'Every attempt is evaluated and recorded, including the ones we refused.' }
  };
  var GATES = [
    { id: 'G1', key: 'consent', name: 'Consent', d: 'A recorded, unexpired consent covers this purpose (and WhatsApp opt-out).' },
    { id: 'G2', key: 'residency', name: 'Residency (Mumbai)', d: 'The record’s residency domain matches the tenant’s. No override exists.' },
    { id: 'G3', key: 'retention', name: 'Retention', d: 'The record is inside its declared retention window.' },
    { id: 'G4', key: 'dual', name: 'Dual control', d: 'A second named person has approved this write.' },
    { id: 'G5', key: 'rate', name: 'Rate', d: 'Within the declared per-actor rate.', opt: true, param: ['Writes per minute, per actor', '10'] },
    { id: 'G6', key: 'budget', name: 'Budget', d: 'Within the declared per-period budget.', opt: true, param: ['Writes per month, per agent', '250'] },
    { id: 'G7', key: 'counterparty', name: 'Counterparty', d: 'The counterparty is known and not sanctioned.' },
    { id: 'G8', key: 'schedule', name: 'Schedule', d: 'Inside a declared operating window.', opt: true, param: ['Operating window (IST)', 'Mon–Sat 09:00–20:00'] },
    { id: 'G9', key: 'precondition', name: 'Precondition', d: 'A declared record state holds: credit limit, period open, no duplicate invoice number.' }
  ];

  function defaults() {
    return {
      org: { legal: 'Sahyadri Agro Foods LLP', gstin: '27ABDFS3321P1ZQ', city: 'Nashik', turnover: '25-50', owner: 'Anand Kulkarni', ownerEmail: 'anand.kulkarni@sahyadriagro.in' },
      residency: { profile: 'H1', ack: false },
      system: { target: 'erpnext', url: 'https://sahyadri.rung1.in', user: 'elan1-kernel@sahyadriagro.in', mode: 'custody', tested: false },
      pack: 'invoice1',
      decl: { start: 'pack', author: 'Farah Sheikh', certifier: 'Arjun Mehta', certified: false },
      gates: { rate: { on: true, v: '10', adr: '' }, budget: { on: true, v: '250', adr: '' }, schedule: { on: false, v: 'Mon–Sat 09:00–20:00', adr: 'ADR-0031' } },
      people: [
        { name: 'Anand Kulkarni', email: 'anand.kulkarni@sahyadriagro.in', role: 'Finance controller', set: 'owners' },
        { name: 'Meera Joshi', email: 'meera.joshi@sahyadriagro.in', role: 'Designated partner', set: 'owners' },
        { name: 'Shalini Deshmukh', email: 'shalini.deshmukh@sahyadriagro.in', role: 'Accounts head', set: 'ar-approvers' },
        { name: 'Vikram Shinde', email: 'vikram.shinde@sahyadriagro.in', role: 'Purchase head', set: 'ap-approvers' },
        { name: 'Rohit Patil', email: 'rohit.patil@sahyadriagro.in', role: 'Accounts executive', set: 'none' }
      ],
      agent: { name: 'invoice-drafter', via: 'sdk', sponsor: 'Shalini Deshmukh', model: 'claude-sonnet', sandboxGrant: true, registered: false },
      proof: { committed: false, refused: false, escalated: false, resolved: false, replay: false },
      production: { owner: 'Anand Kulkarni', file: false, submitted: false, id: null, at: null },
      done: {}
    };
  }
  function S() {
    var d = defaults(), s = E1.store.get('access.onb', null);
    if (!s || typeof s !== 'object') return d;
    Object.keys(d).forEach(function (k) {
      if (s[k] === undefined) s[k] = d[k];
      else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) Object.keys(d[k]).forEach(function (kk) { if (s[k][kk] === undefined) s[k][kk] = d[k][kk]; });
    });
    return s;
  }
  function save(s) { E1.store.set('access.onb', s); }
  var errs = {}, errStep = null;

  function doneCount(s) { return STEPS.filter(function (x) { return s.done[x.id]; }).length; }
  function minutesLeft(s) { return STEPS.filter(function (x) { return !s.done[x.id]; }).reduce(function (a, x) { return a + x.min; }, 0); }
  function firstOpen(s) { for (var i = 0; i < STEPS.length; i++) if (!s.done[STEPS[i].id]) return STEPS[i].id; return 'done'; }

  function summaryRows(s) {
    var pk = PACKS[s.pack] || PACKS.none;
    var approvers = s.people.filter(function (x) { return x.set !== 'none'; }).length;
    var gatesOn = 6 + ['rate', 'budget', 'schedule'].filter(function (k) { return s.gates[k].on; }).length;
    var proofN = ['committed', 'refused', 'resolved'].filter(function (k) { return s.proof[k]; }).length;
    return {
      organisation: s.org.legal ? s.org.legal + ' · ' + (s.org.gstin || 'no GSTIN') + ' · owner ' + (s.org.owner || '—') : '',
      residency: 'in · Mumbai (ap-south-1) · ' + (s.residency.profile === 'H2' ? 'dedicated domain (H2)' : 'shared domain (H1)'),
      system: s.system.target === 'erpnext' ? 'ERPNext · ' + (s.system.url || '').replace(/^https?:\/\//, '') + ' · ' + MODES[s.system.mode].t + (s.system.tested ? ' · connected' : ' · not tested') : '',
      pack: s.pack === 'none' ? 'No pack · own declaration' : pk.name + ' · ' + pk.t,
      declaration: pk.decl + ' v1 · ' + (s.decl.start === 'import' ? 'imported' : s.decl.start === 'blank' ? 'blank' : 'from ' + pk.name) + (s.decl.certified ? ' · certified by ' + s.decl.certifier : ' · not yet certified'),
      gates: gatesOn + ' of 9 on · 6 locked',
      people: s.people.length + ' people · ' + approvers + ' may approve',
      agents: (s.agent.name || '—') + ' · ' + (s.agent.via === 'mcp' ? 'MCP' : 'SDK') + ' · sponsor ' + (s.agent.sponsor || '—') + (s.agent.registered ? ' · registered' : ''),
      'sandbox-proof': proofN + ' of 3 outcomes proved' + (s.proof.replay ? ' · replay checked' : ''),
      production: s.production.submitted ? s.production.id + ' · in review · two working days' : 'Not requested',
      done: s.done.production || s.production.submitted ? 'Ready to hand over' : ''
    };
  }
  var SUM_ICON = { organisation: 'building', residency: 'map-pin', system: 'server', pack: 'package', declaration: 'file-text', gates: 'gate', people: 'users', agents: 'agents', 'sandbox-proof': 'proof', production: 'key', done: 'check' };
  function summaryHtml(s, cur) {
    var rows = summaryRows(s), n = doneCount(s);
    return '<section class="acc-sum" aria-labelledby="acc-sum-h"><div class="acc-sum__head">' + c.progressArc(n, STEPS.length, { size: 60 }) +
      '<div><h2 id="acc-sum-h">Your setup so far</h2><p>' + n + ' of 11 steps done · ' + (n === STEPS.length ? 'complete' : 'about ' + minutesLeft(s) + ' min left') + '</p></div></div>' +
      '<ul class="acc-sum__list" role="list">' + STEPS.filter(function (x) { return x.id !== 'done'; }).map(function (x) {
        var dn = !!s.done[x.id], isCur = x.id === cur, show = dn || isCur, v = rows[x.id];
        return '<li class="acc-sum__row' + (dn ? ' is-done' : '') + (isCur ? ' is-current' : '') + '"><span class="acc-sum__ic">' + c.icon(dn ? 'check' : SUM_ICON[x.id], 16) + '</span><span style="min-width:0"><span class="acc-sum__k">' + esc(x.label) + (isCur ? ' · editing' : '') + '</span>' +
          '<span class="acc-sum__v' + (show && v ? '' : ' is-empty') + '">' + esc(show && v ? v : 'Not yet') + '</span></span></li>';
      }).join('') + '</ul>' +
      '<div class="acc-sum__foot"><strong>At the end you can claim ' + esc('L1 Guarded') + ':</strong> every write is checked before it happens, the ones that need a person get one, and every attempt is in a hash-chained log. Not signed yet; that is L2.</div></section>';
  }

  E1.layouts.wizard = function (content, def, title) {
    var s = S(), stepId = (E1.state.route.params || {}).step || null, idx = stepIdx(stepId), n = doneCount(s);
    var pct = Math.round(n / STEPS.length * 100);
    var steps = '<nav class="acc-wz__steps" aria-label="Setup steps"><div class="acc-vhead"><span class="e1-label">Setup</span><span class="e1-caption e1-muted">' + n + ' of 11 done</span></div>' +
      '<div class="acc-vtrack" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
      '<a class="acc-vpre' + (!stepId ? ' is-current' : '') + '" href="#/onboarding"' + (!stepId ? ' aria-current="page"' : '') + '>' + c.icon('home', 16) + '<span>Before you start</span></a>' +
      '<ol class="acc-vsteps" role="list">' + STEPS.map(function (x, i) {
        var st = x.id === stepId ? 'current' : s.done[x.id] ? 'done' : 'todo';
        return '<li class="acc-vstep acc-vstep--' + st + '"><a href="#/onboarding/' + x.id + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="acc-vstep__n">' + (st === 'done' ? c.icon('check', 12) : i + 1) + '</span><span><span class="acc-vstep__l">' + esc(x.label) + '<span class="e1-sr"> — ' + { done: 'done', current: 'current step', todo: 'not started' }[st] + '</span></span><span class="acc-vstep__note">' + esc(x.note) + '</span></span></a></li>';
      }).join('') + '</ol>' +
      '<div class="acc-vhelp"><span>' + c.icon('help', 14) + ' Stuck? A named person answers within one working day.</span><a href="#/contact">Talk to us</a><a href="#/developers/quickstart">Developer quickstart</a></div></nav>';
    var mprog = '<div class="acc-wz__mprog"><div class="acc-mprog__row"><span>' + (idx >= 0 ? 'Step ' + (idx + 1) + ' of 11' : 'Before you start') + '</span><b>' + esc(idx >= 0 ? STEPS[idx].label : 'Overview') + '</b></div><div class="acc-vtrack" style="margin:0" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div>';
    return '<div class="e1-app acc-wz">' +
      '<header class="acc-wz__head" role="banner"><button type="button" class="e1-skip" data-action="skip">Skip to content</button>' + E1.logo('auto', '#/onboarding') +
      '<div class="acc-wz__title"><b>Set up elan1</b><span>' + esc(s.org.legal || 'Your organisation') + '</span></div>' +
      '<span class="e1-envtag e1-envtag--sandbox acc-wz__env">Sandbox tenant</span><span class="acc-wz__spacer"></span>' +
      '<span class="acc-wz__time">' + c.icon('clock', 14) + (n === STEPS.length ? 'Complete' : 'About ' + minutesLeft(s) + ' min left') + '</span>' +
      '<button type="button" class="e1-iconbtn acc-wz__theme" data-action="theme" aria-label="' + (E1.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') + '">' + c.icon(E1.state.theme === 'dark' ? 'sun' : 'moon', 18) + '</button>' +
      c.button('Save and exit', { kind: 'secondary', size: 'sm', attrs: 'data-action="acc-onb-exit"' }) + '</header>' +
      mprog +
      '<div class="acc-wz__body">' + steps +
      '<main class="acc-wz__main" id="e1-main" tabindex="-1">' + content + '</main>' +
      '<aside class="acc-wz__sum" aria-label="Setup summary">' + summaryHtml(s, stepId) + '</aside></div></div>';
  };

  function refreshSummary() {
    var s = S(), aside = document.querySelector('.acc-wz__sum');
    if (aside) aside.innerHTML = summaryHtml(s, (E1.state.route.params || {}).step);
  }

  /* ---- Welcome ------------------------------------------------------------ */
  E1.route('/onboarding', {
    title: 'Set up elan1', layout: 'wizard', keywords: 'onboarding setup wizard welcome',
    render: function (p, qy) {
      var s = S(), n = doneCount(s), resume = n > 0 && n < STEPS.length;
      var needs = [
        ['building', 'Your legal entity and GSTIN', 'Prefilled from your sandbox sign-up and the GST register. Check them.'],
        ['server', 'Your ERPNext site and an API user', 'We connect with Frappe’s own API. The kernel will hold the credential.'],
        ['users', 'The names of your approvers', 'People, not distribution lists. At least two owners for dual control.'],
        ['user', 'A named production owner', 'The person we call when something is wrong. A person, not a list.'],
        ['code', 'A developer for about 15 minutes', 'To register your first agent with the SDK or over MCP.'],
        ['timer', 'Two working days, later', 'Production keys are issued by us after a person reads your request.']
      ];
      return '<div class="acc-step">' +
        c.pageHeader({ eyebrow: resume ? 'Setup · welcome back' : 'Setup · before you start', title: resume ? 'Pick up where you left off' : 'Set up elan1 for ' + s.org.legal,
          lead: resume ? n + ' of 11 steps are done. Nothing you saved has been sent anywhere; your sandbox tenant is waiting.' : 'Eleven steps. You finish with a governed write proved in your sandbox tenant and a production request that a person will read.',
          actions: (resume ? c.button('Start over', { kind: 'ghost', attrs: 'data-action="acc-onb-reset"' }) : '') + c.button(resume ? 'Continue with ' + STEPS[stepIdx(firstOpen(s))].label : 'Start with your organisation', { kind: 'primary', href: '#/onboarding/' + (resume ? firstOpen(s) : 'organisation'), iconRight: 'arrow-right' }) }) +
        c.miniHead([{ label: 'Steps', value: String(STEPS.length) }, { label: 'Done', value: n + ' of ' + STEPS.length }, { label: 'Your time', value: 'About ' + minutesLeft(s) + ' min' }, { label: 'Tenant', value: 'Sandbox', note: 'synthetic data' }, { label: 'Production key', value: 'Issued by a person', note: '~2 working days' }]) +
        '<div class="acc-mt-lg"></div>' +
        c.section({ id: 'need', title: 'What you will need', body: '<div class="acc-needs">' + needs.map(function (x) { return '<div class="acc-need"><span class="acc-need__i">' + c.icon(x[0], 16) + '</span><div><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div></div>'; }).join('') + '</div>' }) +
        c.section({ id: 'plan', title: 'The eleven steps', lead: 'You can save and exit at any step. Nothing reaches a live system until a production key is issued.', body: '<ol class="acc-plan" role="list">' + STEPS.map(function (x, i) {
          return '<li><span class="acc-plan__n">' + (i + 1) + '</span><span><a href="#/onboarding/' + x.id + '">' + esc(x.label) + '</a> <span class="e1-caption e1-muted">· ' + esc(x.note) + '</span> ' + (s.done[x.id] ? c.badge('good', 'Done', { subtle: true }) : '') + '</span><span class="acc-plan__m">' + x.min + ' min</span></li>';
        }).join('') + '</ol>' }) +
        c.callout({ kind: 'rule', title: 'What setup will not do', body: '<p>It will not issue a production key. Production keys are issued by us, never self-serve in Phase 1, because a production key is a credential to somebody’s books and there is no honest way to issue one without a human reading what the applicant declared.</p>' }) +
        '<div class="acc-stepnav"><a class="e1-btn e1-btn--ghost" href="#/work/today">' + c.icon('arrow-left', 16) + '<span>Back to the console</span></a><span class="acc-stepnav__hint">About ' + minutesLeft(s) + ' minutes left</span>' +
        c.button(resume ? 'Continue' : 'Start', { kind: 'primary', href: '#/onboarding/' + firstOpen(s), iconRight: 'arrow-right' }) + '</div></div>';
    }
  });
  E1.action('acc-onb-reset', function () {
    E1.confirm({ title: 'Start setup over?', body: '<p>Your saved answers on this device are cleared. Your sandbox tenant and its chain are not touched: sandbox proof entries stay in the chain.</p>', confirmLabel: 'Start over', kind: 'danger',
      onConfirm: function () { E1.store.set('access.onb', null); errs = {}; E1.toast('Setup restarted.', 'neutral'); E1.go('/onboarding/organisation'); } });
  });
  E1.action('acc-onb-exit', function () {
    var step = (E1.state.route.params || {}).step;
    if (step && COLLECT[step]) { var s = S(); COLLECT[step](s); save(s); }
    var s2 = S();
    E1.toast('Saved at ' + (step ? STEPS[stepIdx(step)].label : 'the start') + '. Pick up from the user menu or at #/onboarding.', 'good', { title: 'Setup saved', action: { label: 'Resume', href: '#/onboarding/' + (step || firstOpen(s2)) } });
    E1.go('/work/today');
  });

  /* ---- Step frame --------------------------------------------------------- */
  function opt(name, value, cur, o) {
    var dis = o.disabled;
    return '<label class="acc-opt' + (dis ? ' is-disabled' : '') + '"><input type="radio" data-bind name="' + esc(name) + '" value="' + esc(value) + '"' + (cur === value ? ' checked' : '') + (dis ? ' disabled' : '') + '>' +
      '<span class="acc-opt__top"><span class="acc-opt__t">' + (o.icon ? c.icon(o.icon, 16) : '') + esc(o.t) + '</span>' + (o.badge || '<span class="acc-opt__radio" aria-hidden="true"></span>') + '</span>' +
      (o.d ? '<span class="acc-opt__d">' + (o.dHtml ? o.d : esc(o.d)) + '</span>' : '') + (o.foot ? '<span class="acc-opt__foot">' + o.foot + '</span>' : '') + '</label>';
  }
  function errSummary(step) {
    if (errStep !== step) return '';
    var keys = Object.keys(errs); if (!keys.length) return '';
    return '<div class="acc-errsum" role="alert" id="acc-errsum" tabindex="-1"><p>' + c.icon('alert', 16) + (keys.length === 1 ? 'One thing needs attention before you continue' : keys.length + ' things need attention before you continue') + '</p><ul>' +
      keys.map(function (k) { return '<li><a href="' + esc(here()) + '" data-scrollto="' + esc(k) + '">' + esc(errs[k]) + '</a></li>'; }).join('') + '</ul></div>';
  }
  function E(id) { return errStep && errs[id] ? errs[id] : ''; }
  function stepFrame(id, title, lead, body, o) {
    o = o || {};
    var i = stepIdx(id), s = S(), prev = i > 0 ? '#/onboarding/' + STEPS[i - 1].id : '#/onboarding';
    var earlier = STEPS.slice(0, i).filter(function (x) { return !S().done[x.id] && x.id !== 'done'; });
    var ahead = earlier.length && id !== 'done' ? '<div class="acc-note acc-note--warning" style="margin-bottom:20px">' + c.icon('info', 16) + '<span><strong>You are looking ahead.</strong> ' + esc(earlier.map(function (x) { return x.label; }).join(', ')) + (earlier.length === 1 ? ' is' : ' are') + ' not done yet. You can fill this in now; setup finishes only when every step is done. <a class="acc-link" href="#/onboarding/' + earlier[0].id + '">Go to ' + esc(earlier[0].label) + '</a></span></div>' : '';
    return '<div class="acc-step">' + c.pageHeader({ eyebrow: 'Step ' + (i + 1) + ' of 11 · ' + STEPS[i].label, title: title, lead: lead, actions: o.actions }) +
      ahead + errSummary(id) + body +
      (o.nonav ? '' : '<div class="acc-stepnav"><a class="e1-btn e1-btn--ghost" href="' + prev + '">' + c.icon('arrow-left', 16) + '<span>Back</span></a>' +
        c.button('Save and exit', { kind: 'ghost', attrs: 'data-action="acc-onb-exit"' }) +
        '<span class="acc-stepnav__hint">' + esc(o.hint || (s.done[id] ? 'Done. Changes are saved when you continue.' : 'Saved as you type, on this device.')) + '</span>' +
        c.button(o.next || 'Continue', { kind: 'primary', iconRight: 'arrow-right', attrs: 'data-action="acc-onb-next" data-value="' + id + '"' }) + '</div>') + '</div>';
  }

  /* ---- Collect + validate per step --------------------------------------- */
  var COLLECT = {
    organisation: function (s) { ['legal', 'gstin', 'city', 'owner', 'ownerEmail'].forEach(function (k) { var v = val('org-' + k); if (v !== null) s.org[k] = k === 'gstin' ? v.toUpperCase() : v; }); var t = val('org-turnover'); if (t !== null) s.org.turnover = t; },
    residency: function (s) { var r = radio('res-profile'); if (r) s.residency.profile = r; var a = checked('res-ack'); if (a !== null) s.residency.ack = a; },
    system: function (s) { var t = radio('sys-target'); if (t) s.system.target = t; var u = val('sys-url'); if (u !== null) { if (u !== s.system.url) s.system.tested = false; s.system.url = u; } var us = val('sys-user'); if (us !== null) s.system.user = us; var m = radio('sys-mode'); if (m) s.system.mode = m; },
    pack: function (s) { var p = radio('pack'); if (p) s.pack = p; },
    declaration: function (s) { var st = radio('decl-start'); if (st) s.decl.start = st; var a = val('decl-author'), ce = val('decl-certifier'); if (a !== null) s.decl.author = a; if (ce !== null) { if (ce !== s.decl.certifier) s.decl.certified = false; s.decl.certifier = ce; } },
    gates: function (s) { ['rate', 'budget', 'schedule'].forEach(function (k) { var on = checked('gate-' + k); if (on !== null) s.gates[k].on = on; var v = val('gate-' + k + '-v'); if (v !== null) s.gates[k].v = v; var a = val('gate-' + k + '-adr'); if (a !== null) s.gates[k].adr = a.toUpperCase(); }); },
    people: function () { },
    agents: function (s) { var n = val('ag-name'); if (n !== null) { if (n !== s.agent.name) s.agent.registered = false; s.agent.name = n; } var v = radio('ag-via'); if (v) s.agent.via = v; var sp = val('ag-sponsor'); if (sp !== null) s.agent.sponsor = sp; var m = val('ag-model'); if (m !== null) s.agent.model = m; var g = checked('ag-grant'); if (g !== null) s.agent.sandboxGrant = g; },
    'sandbox-proof': function () { },
    production: function (s) { var o = val('prod-owner'); if (o !== null) s.production.owner = o; },
    done: function () { }
  };
  var VALIDATE = {
    organisation: function (s) {
      var e = {};
      if ((s.org.legal || '').length < 3) e['org-legal'] = 'Enter the legal name as it appears on the GST certificate.';
      if (!GSTIN_RE.test(s.org.gstin || '')) e['org-gstin'] = 'A GSTIN is 15 characters, like 27ABDFS3321P1ZQ.';
      if (!s.org.turnover) e['org-turnover'] = 'Choose a turnover band.';
      if ((s.org.owner || '').split(/\s+/).filter(Boolean).length < 2) e['org-owner'] = 'Name one person, first and last name. Give us a person, not a distribution list.';
      if (!EMAIL_RE.test(s.org.ownerEmail || '')) e['org-ownerEmail'] = 'Enter an e-mail address like name@company.in.';
      else if (LIST_RE.test(s.org.ownerEmail)) e['org-ownerEmail'] = 'Give us a person, not a distribution list.';
      return e;
    },
    residency: function (s) { return s.residency.ack ? {} : { 'res-ack': 'Tick the acknowledgement. Residency is the one choice here that cannot be undone.' }; },
    system: function (s) {
      var e = {};
      if (s.system.target !== 'erpnext') e['sys-target'] = 'Only hosted ERPNext is available in Phase 1.';
      if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(s.system.url || '')) e['sys-url'] = 'Enter the site address starting with https://, like https://sahyadri.rung1.in.';
      if (!EMAIL_RE.test(s.system.user || '')) e['sys-user'] = 'Enter the ERPNext API user, like elan1-kernel@yourcompany.in.';
      if (!s.system.tested && !e['sys-url']) e['sys-test'] = 'Test the connection first. We continue only when the kernel can reach the site.';
      return e;
    },
    pack: function (s) { return s.pack ? {} : { pack: 'Choose a pack, or No pack.' }; },
    declaration: function (s) {
      var e = {};
      if (!s.decl.start) e['decl-start'] = 'Choose where the declaration starts from.';
      if (s.decl.author && s.decl.author === s.decl.certifier) e['decl-certifier'] = 'The certifier must not be the author. Certification is dual control.';
      return e;
    },
    gates: function (s) {
      var e = {};
      ['rate', 'budget', 'schedule'].forEach(function (k) {
        var g = s.gates[k];
        if (!g.on && !ADR_RE.test(g.adr || '')) e['gate-' + k + '-adr'] = GATES.filter(function (x) { return x.key === k; })[0].name + ' is off, so it needs a decision record like ADR-0031.';
        if (g.on && !String(g.v || '').trim()) e['gate-' + k + '-v'] = 'Give ' + k + ' a value, or turn it off with a decision record.';
      });
      return e;
    },
    people: function (s) {
      var e = {}, by = {};
      s.people.forEach(function (p) { (by[p.set] = by[p.set] || []).push(p); });
      if (!(by['ar-approvers'] || []).length) e['ppl-table'] = 'Put at least one person in ar-approvers.';
      else if (!(by['ap-approvers'] || []).length) e['ppl-table'] = 'Put at least one person in ap-approvers.';
      if ((by.owners || []).length < 2) e['ppl-owners'] = 'owners needs two different people, so dual control always has a second approver.';
      return e;
    },
    agents: function (s) {
      var e = {};
      if (!/^[a-z0-9][a-z0-9-]{2,39}$/.test(s.agent.name || '')) e['ag-name'] = 'Use 3–40 lower-case letters, digits and hyphens, like invoice-drafter.';
      if (!s.agent.sponsor) e['ag-sponsor'] = 'Name the person behind this agent. An agent with no sponsor is refused.';
      if (!s.agent.registered && !e['ag-name']) e['ag-register'] = 'Register the agent in your sandbox tenant before you continue.';
      return e;
    },
    'sandbox-proof': function (s) {
      var e = {};
      if (!s.proof.committed) e['run-committed'] = 'Prove a committed write.';
      if (!s.proof.refused) e['run-refused'] = 'Prove a real refusal.';
      if (!s.proof.resolved) e['run-escalated'] = 'Prove an escalation resolved by a real human.';
      return e;
    },
    production: function (s) {
      var e = {};
      if (!s.production.submitted) e['prod-send'] = 'Send the request, or choose to keep working in the sandbox tenant for now.';
      return e;
    },
    done: function () { return {}; }
  };

  E1.action('acc-onb-next', function (el) {
    var id = el.getAttribute('data-value'), s = S();
    COLLECT[id](s); save(s);
    var e = VALIDATE[id](s);
    if (Object.keys(e).length) {
      errs = e; errStep = id; E1.render({ keepScroll: true });
      var box = document.getElementById('acc-errsum'); if (box) { box.focus(); box.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' }); }
      E1.announce(Object.keys(e).length + ' things need attention.');
      return;
    }
    errs = {}; errStep = null;
    s.done[id] = true; save(s);
    var i = stepIdx(id);
    if (id === 'done') { E1.toast('Setup complete. Your sandbox tenant is ready.', 'good'); return E1.go('/work/today'); }
    E1.go('/onboarding/' + STEPS[i + 1].id);
  });
  E1.on('input', '.acc-wz [data-bind]', function (e, el) { liveCollect(el, false); });
  E1.on('change', '.acc-wz [data-bind]', function (e, el) { liveCollect(el, true); });
  function liveCollect(el, isChange) {
    var step = (E1.state.route.params || {}).step; if (!step || !COLLECT[step]) return;
    var s = S(); COLLECT[step](s); save(s); refreshSummary();
    var t = el && (el.type || el.tagName.toLowerCase());
    var structural = t === 'radio' || t === 'checkbox' || t === 'select-one';
    if (!isChange || !structural) return;
    if (['gates', 'pack', 'system', 'residency', 'agents', 'declaration'].indexOf(step) < 0) return;
    var focusSel = el.id ? '#' + el.id : (el.name ? 'input[name="' + el.name + '"][value="' + el.value + '"]' : null);
    E1.render({ keepScroll: true });
    if (focusSel) { var f = document.querySelector('#e1-main ' + focusSel); if (f) { try { f.focus({ preventScroll: true }); } catch (e2) { f.focus(); } } }
  }

  /* ---- Step renders ------------------------------------------------------- */
  var R = {};
  R.organisation = function (s) {
    var tb = [{ value: '', label: 'Choose a band' }, { value: 'lt5', label: 'Under ₹5 crore' }, { value: '5-25', label: '₹5–25 crore' }, { value: '25-50', label: '₹25–50 crore' }, { value: '50-250', label: '₹50–250 crore' }, { value: 'gt250', label: 'Above ₹250 crore' }];
    return stepFrame('organisation', 'Your organisation', 'Who is being governed, and which person answers for it. Prefilled from your sandbox sign-up and the GST register; check each line.',
      '<div class="acc-panel"><h2 class="acc-panel__h">Legal entity</h2><p class="acc-panel__lead">This becomes the tenant. Tenancy then comes from every token and is never a call argument.</p><div class="acc-fgrid">' +
      '<div class="is-wide">' + c.field('Legal name', c.input({ id: 'org-legal', value: s.org.legal, attrs: 'data-bind', invalid: !!E('org-legal') }), { id: 'org-legal', required: true, error: E('org-legal'), help: 'As on the GST certificate.' }) + '</div>' +
      c.field('GSTIN', c.input({ id: 'org-gstin', value: s.org.gstin, mono: true, attrs: 'data-bind maxlength="15" autocapitalize="characters"', invalid: !!E('org-gstin') }), { id: 'org-gstin', required: true, error: E('org-gstin'), help: 'Verified against the GST register: active, Maharashtra (27).' }) +
      c.field('Registered city', c.input({ id: 'org-city', value: s.org.city, attrs: 'data-bind' }), { id: 'org-city', optional: true }) +
      c.field('Annual turnover', c.select({ id: 'org-turnover', options: tb, value: s.org.turnover, attrs: 'data-bind', invalid: !!E('org-turnover') }), { id: 'org-turnover', required: true, error: E('org-turnover'), help: 'e-invoicing applies above ₹5 crore. Used to suggest a pack, never to price per seat.' }) +
      '</div></div>' +
      '<div class="acc-panel"><h2 class="acc-panel__h">Production owner</h2><p class="acc-panel__lead">The person we call when something is wrong, and the notice contact for incidents and key changes. A person, not a distribution list.</p><div class="acc-fgrid">' +
      c.field('Full name', c.input({ id: 'org-owner', value: s.org.owner, attrs: 'data-bind autocomplete="name"', invalid: !!E('org-owner') }), { id: 'org-owner', required: true, error: E('org-owner') }) +
      c.field('Work e-mail', c.input({ id: 'org-ownerEmail', type: 'email', value: s.org.ownerEmail, attrs: 'data-bind', invalid: !!E('org-ownerEmail') }), { id: 'org-ownerEmail', required: true, error: E('org-ownerEmail'), help: 'Try accounts@… to see what we say.' }) +
      '</div><div class="acc-note acc-mt">' + c.icon('info', 16) + '<span>The declaration names an <strong>owner role</strong>, because people leave. The production owner is a named person, because someone has to pick up the phone.</span></div></div>');
  };
  R.residency = function (s) {
    return stepFrame('residency', 'Where your records live', 'Choose the residency domain for your chain, keys and snapshots. Residency gate G2 checks every write against it.',
      c.callout({ kind: 'caveat', title: 'This choice is permanent', body: '<p>Residency and key custody sit at the lowest architectural plane, which has no migration path — every choice there is permanent.</p>' }) +
      '<div class="acc-opts acc-opts--2 acc-mt" role="radiogroup" aria-label="Residency domain" id="res-profile">' +
      opt('res-profile', 'H1', s.residency.profile, { t: 'India · Mumbai', icon: 'map-pin', d: 'Residency domain in, ap-south-1, three availability zones, synchronous standby. Shared hosting (H1). The default.', foot: c.badge('good', 'Available', { subtle: true }) + c.chip('DPDP Act 2023') }) +
      opt('res-profile', 'H2', s.residency.profile, { t: 'India · dedicated domain', icon: 'lock', d: 'The same region with a domain of your own (H2): the only way to get a signing key no other tenant uses, from Assurance Level 2.', foot: c.badge('info', 'On request', { subtle: true }) + c.chip('Talk to us first') }) +
      opt('res-profile', 'gulf', s.residency.profile, { t: 'Gulf', icon: 'globe', d: 'A new residency domain with a new signing key.', disabled: true, badge: c.badge('neutral', 'Not in Phase 1', { subtle: true }) }) +
      opt('res-profile', 'eu', s.residency.profile, { t: 'European Union', icon: 'globe', d: 'A new residency domain with a new signing key.', disabled: true, badge: c.badge('neutral', 'Not in Phase 1', { subtle: true }) }) +
      '</div>' +
      (s.residency.profile === 'H2' ? '<div class="acc-note acc-note--info acc-mt">' + c.icon('info', 16) + '<span>A dedicated domain is set up with you by a person. Setup continues on the shared domain meanwhile; <strong>moving later is itself a migration we cannot offer</strong>, so we hold your sandbox tenant until the domain exists.</span></div>' : '') +
      '<div class="acc-two acc-mt">' +
      c.card({ title: 'What stays in India', body: '<ul class="acc-list">' +
        ['Proof records, the chain and its snapshots', 'Declarations, lexicons and version history', 'Meter events and invoices', 'Model inference for the console (vLLM in Mumbai)', 'Backups: point-in-time, nightly, 30 days. No second region, including for recovery'].map(function (x) { return '<li>' + c.icon('map-pin', 14) + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' }) +
      c.card({ title: 'Your data under DPDP', body: c.kv([['elan1 is', 'Data Processor for your tenant data; Data Fiduciary for your users’ accounts'], ['Before the first real record', 'A signed data processing agreement'], ['Consent', 'A ledger with purpose, time, lawful basis and notice version, not a yes/no column'], ['Erasure', 'Within 72 hours, dual control; the chain stays intact']], { compact: true }) +
        '<p class="e1-caption acc-mt"><a class="acc-link" href="#/legal/dpa">Read the DPA</a> · <a class="acc-link" href="#/security/subprocessors">Sub-processors</a> · <a class="acc-link" href="#/assurance/residency">Residency on the Assurance door</a></p>' }) + '</div>' +
      '<div class="acc-panel acc-mt" id="res-ack-wrap">' + c.checkbox({ id: 'res-ack', label: 'I understand the residency domain cannot be changed later', note: 'Recorded with your name and the time when you continue.', checked: s.residency.ack, attrs: 'data-bind' }) +
      (E('res-ack') ? '<p class="e1-field__error" id="res-ack-msg" role="alert">' + c.icon('alert', 12) + '<span>' + esc(E('res-ack')) + '</span></p>' : '') + '</div>');
  };
  R.system = function (s) {
    var m = MODES[s.system.mode] || MODES.custody;
    return stepFrame('system', 'Connect your system of record', 'elan1 writes to your books through one writer. Choose the system and how the credential is held.',
      '<div class="acc-opts" role="radiogroup" aria-label="System of record" id="sys-target">' + SYSTEMS.map(function (x) {
        return opt('sys-target', x.id, s.system.target, { t: x.t, icon: x.icon, d: x.d, disabled: !x.live, badge: x.live ? c.badge('good', 'Live', { subtle: true }) : c.badge('neutral', 'Later', { subtle: true }), foot: x.live ? '' : '<button type="button" class="e1-btn e1-btn--ghost e1-btn--sm" data-action="acc-notify-later" data-value="' + esc(x.t) + '">' + c.icon('bell', 14) + '<span>Tell me when</span></button>' });
      }).join('') + '</div>' +
      (E('sys-target') ? '<p class="e1-field__error" role="alert">' + c.icon('alert', 12) + '<span>' + esc(E('sys-target')) + '</span></p>' : '') +
      '<div class="acc-panel acc-mt"><h2 class="acc-panel__h">ERPNext site</h2><p class="acc-panel__lead">We use Frappe’s own REST API. Target credentials minted for each write expire in 10 minutes.</p><div class="acc-fgrid">' +
      c.field('Site address', c.input({ id: 'sys-url', value: s.system.url, mono: true, attrs: 'data-bind inputmode="url"', invalid: !!E('sys-url') }), { id: 'sys-url', required: true, error: E('sys-url') }) +
      c.field('API user', c.input({ id: 'sys-user', value: s.system.user, mono: true, attrs: 'data-bind', invalid: !!E('sys-user') }), { id: 'sys-user', required: true, error: E('sys-user'), help: 'A dedicated ERPNext user with the Accounts Manager role.' }) +
      '</div><div id="sys-test" class="acc-mt">' + testBlock(s) + '</div></div>' +
      '<div class="acc-panel"><h2 class="acc-panel__h">Enforcement mode</h2><p class="acc-panel__lead">Say which mode this deployment is in, in writing, on the first call. It is declared per write type, printed in every export, and can never be set in a tool call.</p>' +
      '<div class="acc-opts acc-opts--1" role="radiogroup" aria-label="Enforcement mode" id="sys-mode">' + ['custody', 'token', 'advisory'].map(function (k) {
        return opt('sys-mode', k, s.system.mode, { t: MODES[k].t, d: MODES[k].d, foot: k === 'custody' ? c.badge('info', 'Recommended for hosted ERPNext', { subtle: true }) : '' });
      }).join('') + '</div>' +
      '<div class="acc-sentence acc-mt" style="margin-bottom:0"><span class="e1-label">What you may then say</span><br>“' + esc(m.say) + '”</div>' +
      (s.system.mode === 'advisory' ? '<p class="e1-caption e1-muted" style="margin-top:8px">In attested advisory, never say “we block”, “we prevent” or “nothing gets through without us”. Every record carries the caller-performed flag.</p>' : '') + '</div>');
  };
  function testBlock(s) {
    if (!s.system.tested) {
      return '<div class="acc-inline">' + c.button('Test the connection', { kind: 'secondary', icon: 'plug', attrs: 'data-action="acc-sys-test"' }) + '<span class="e1-caption e1-muted">Reads only. Nothing is written to ERPNext.</span></div>' +
        (E('sys-test') ? '<p class="e1-field__error" role="alert" style="margin-top:8px">' + c.icon('alert', 12) + '<span>' + esc(E('sys-test')) + '</span></p>' : '');
    }
    var checks = [['Site reachable over TLS 1.3', (s.system.url || '').replace(/^https?:\/\//, '') + ' · 212 ms'], ['Frappe 15.38 · ERPNext 15.41 detected', 'Supported'], ['API user can read and submit', 'Sales Invoice · Payment Entry · Customer · Journal Entry'], ['Site hosted in ap-south-1', 'Matches residency domain in'], ['Credential moved into kernel custody', 'Your team no longer holds a copy']];
    return '<ul class="acc-checks" role="list">' + checks.map(function (x) { return '<li class="acc-check"><span class="e1-tone--good">' + c.icon('check', 16) + '</span><span><span class="acc-check__t">' + esc(x[0]) + '</span><span class="acc-check__d">' + esc(x[1]) + '</span></span>' + c.badge('good', 'Passed', { subtle: true }) + '</li>'; }).join('') + '</ul>' +
      '<div class="acc-inline" style="margin-top:8px">' + c.button('Test again', { kind: 'ghost', size: 'sm', icon: 'refresh', attrs: 'data-action="acc-sys-test"' }) + '<span class="e1-caption e1-muted">Checked ' + esc(fmt.time(new Date())) + '</span></div>';
  }
  E1.action('acc-notify-later', function (el) { E1.toast('We will e-mail ' + S().org.owner + ' when ' + el.getAttribute('data-value') + ' is available. No date is promised.', 'info'); });
  E1.action('acc-sys-test', function (el) {
    var s = S(); COLLECT.system(s); save(s);
    var e = VALIDATE.system(s); delete e['sys-test'];
    if (e['sys-url'] || e['sys-user']) { errs = e; errStep = 'system'; return E1.render({ keepScroll: true }); }
    var box = document.getElementById('sys-test');
    if (box) box.innerHTML = '<div class="acc-inline">' + c.button('Testing…', { kind: 'secondary', loading: true, disabled: true }) + '<span class="e1-caption e1-muted">Reaching ' + esc(s.system.url.replace(/^https?:\/\//, '')) + '…</span></div>';
    setTimeout(function () { var s2 = S(); s2.system.tested = true; save(s2); if (errStep === 'system') delete errs['sys-test']; E1.render({ keepScroll: true }); E1.toast('The kernel can reach ERPNext and submit as the API user.', 'good', { title: 'Connected' }); }, reducedMotion() ? 50 : 1200);
  });

  R.pack = function (s) {
    return stepFrame('pack', 'Choose a pack', 'A pack is configuration, not code: one declaration, one verifier profile and one regime mapping, aimed at one obligation.',
      '<div class="acc-opts acc-opts--2" role="radiogroup" aria-label="Pack" id="pack">' + ['ledger1', 'invoice1', 'collect1', 'none'].map(function (k) {
        var p = PACKS[k];
        return opt('pack', k, s.pack, { t: p.name + (k === 'none' ? '' : ' · ' + p.t), icon: k === 'none' ? 'edit' : 'package', d: p.ob, foot: c.badge(k === 'collect1' ? 'warning' : 'neutral', p.status, { subtle: true }) + (k !== 'none' ? '<a class="e1-caption acc-link" href="#/records/packs/' + k + '">Details</a>' : '') });
      }).join('') + '</div>' +
      (function () {
        var p = PACKS[s.pack] || PACKS.none;
        return '<div class="acc-panel acc-mt"><h2 class="acc-panel__h">' + esc(p.name) + ' — what it does not establish</h2><p class="acc-panel__lead" style="margin-bottom:10px">Said in the same breath as what it does.</p><p>' + esc(p.not) + '</p>' +
          '<div class="acc-note acc-mt">' + c.icon('info', 16) + '<span>At Assurance Level 1 a pack gives you its declaration, gates and write types. Its verifier profile starts working at <strong>L2 Attested</strong>; until then nothing on your screens claims it.</span></div></div>';
      })());
  };

  var BLOCKS = [
    ['identity', 'erp.ar · owner role Accounts head · residency in · system erpnext'],
    ['shape', 'Sales Invoice, Customer, Payment Entry · 34 fields · 6 financial, 3 personal'],
    ['permissions', '11 grants · agents start at A0 · may_approve is false for every agent'],
    ['write_types', '6 write types · each with a reversal plan or irreversible: true'],
    ['gates', 'Nine gates in declared order · six locked on'],
    ['proof_binding', '16 fields · elan1_lp_v1 · salt per record'],
    ['channels', 'web, mobile, messaging (notify), api, mcp · mode ' + 'per write type']
  ];
  R.declaration = function (s) {
    var p = PACKS[s.pack] || PACKS.none;
    var names = ['Farah Sheikh', 'Anand Kulkarni', 'Arjun Mehta', 'Shalini Deshmukh'];
    return stepFrame('declaration', 'Choose a starting declaration', 'The declaration is your policy as data. Every screen your approvers see is rendered from it, and every write is checked against it.',
      '<div class="acc-opts" role="radiogroup" aria-label="Starting point" id="decl-start">' +
      opt('decl-start', 'pack', s.decl.start, { t: 'From ' + (s.pack === 'none' ? 'the reference template' : p.name), icon: 'package', d: p.decl + ' v1, adapted to Sahyadri’s chart of accounts. Recommended.' }) +
      opt('decl-start', 'import', s.decl.start, { t: 'Import JSON', icon: 'upload', d: 'Bring a declaration you wrote elsewhere. It is validated before anything else.' }) +
      opt('decl-start', 'blank', s.decl.start, { t: 'Start blank', icon: 'edit', d: 'Write all seven blocks yourself in the Studio.', foot: '<a class="e1-caption acc-link" href="#/records/studio/new">Open the Studio</a>' }) + '</div>' +
      '<div class="acc-panel acc-mt"><h2 class="acc-panel__h">' + esc(p.decl) + ' v1 · seven blocks</h2><p class="acc-panel__lead">Read in order they form one sentence.</p>' +
      '<p class="acc-sentence">This <em>thing</em>, shaped <em>this way</em>, may be changed by <em>these actors</em> through <em>these write types</em>, subject to <em>these gates</em>, proving <em>these fields</em>, over <em>these channels</em>.</p>' +
      '<ol class="acc-blocks" role="list">' + BLOCKS.map(function (b, i) { return '<li class="acc-block"><span class="acc-block__n">' + (i + 1) + '</span><span class="acc-block__name">' + esc(b[0]) + '</span><span class="acc-block__d">' + esc(b[1]) + '</span>' + c.badge('good', 'Valid', { subtle: true }) + '</li>'; }).join('') + '</ol>' +
      '<div class="acc-inline acc-mt">' + c.badge('good', '11 of 11 semantic rules pass', { icon: 'check' }) + c.badge('warning', '1 lint warning', { subtle: true }) + '<span class="e1-caption e1-muted">LN-05: the intent of erp.customer.update repeats its label.</span></div>' +
      '<p class="e1-caption e1-muted" style="margin-top:8px">Every field is a value, out_of_scope with an ADR, or not_measurable with a reason. Never blank, never “tbd”.</p></div>' +
      '<div class="acc-panel"><h2 class="acc-panel__h">Certification</h2><p class="acc-panel__lead">A named person certifies version 1. The certifier must not be the author, and certification is dual control.</p><div class="acc-fgrid">' +
      c.field('Author', c.select({ id: 'decl-author', options: names, value: s.decl.author, attrs: 'data-bind' }), { id: 'decl-author' }) +
      c.field('Certifier', c.select({ id: 'decl-certifier', options: names, value: s.decl.certifier, attrs: 'data-bind', invalid: !!E('decl-certifier') }), { id: 'decl-certifier', error: E('decl-certifier'), help: 'Try picking the author to see the rule.' }) + '</div>' +
      '<div class="acc-mt">' + (s.decl.certified ? '<div class="acc-note acc-note--good">' + c.icon('check', 16) + '<span><strong>Certified at version 1</strong> by ' + esc(s.decl.certifier) + ' · digest <span class="e1-mono">' + esc(fmt.shortHash(hx(p.decl + s.decl.certifier, 64))) + '</span>. Version 1 can never change; the next edit is version 2.</span></div>'
        : '<div class="acc-inline">' + c.button('Send to ' + (s.decl.certifier || 'the certifier') + ' to certify', { kind: 'gate', attrs: 'data-action="acc-certify"' + (s.decl.author === s.decl.certifier ? ' disabled' : '') }) + '<span class="e1-caption e1-muted">Optional now; the production review checks it.</span></div>') + '</div></div>');
  };
  E1.action('acc-certify', function (el) {
    var s = S(); COLLECT.declaration(s); save(s);
    if (s.decl.author === s.decl.certifier) { errs = { 'decl-certifier': 'The certifier must not be the author. Certification is dual control.' }; errStep = 'declaration'; return E1.render({ keepScroll: true }); }
    el.classList.add('is-loading');
    E1.toast('Sent to ' + s.decl.certifier + '. It is waiting in their Work queue.', 'info', { title: 'Certification requested', timeout: 1600 });
    setTimeout(function () { var s2 = S(); s2.decl.certified = true; save(s2); E1.render({ keepScroll: true }); E1.toast(s2.decl.certifier + ' certified ' + (PACKS[s2.pack] || PACKS.none).decl + ' v1.', 'good', { title: 'Certified' }); }, reducedMotion() ? 50 : 1600);
  });

  R.gates = function (s) {
    return stepFrame('gates', 'The gates every write passes', 'Nine gates run at rung 3, in declared order, on every write. Six are never skippable. Rate, budget and schedule may be declared off, and only with a decision record.',
      '<ol class="acc-gates" role="list">' + GATES.map(function (g) {
        if (!g.opt) return '<li class="acc-gate"><span class="acc-gate__id">' + g.id + '</span><span><span class="acc-gate__name">' + esc(g.name) + '</span><span class="acc-gate__d">' + esc(g.d) + '</span></span><span class="acc-gate__lock">' + c.icon('lock', 14) + 'Never skippable</span></li>';
        var st = s.gates[g.key];
        return '<li class="acc-gate' + (st.on ? '' : ' is-off') + '" id="gate-' + g.key + '-row"><span class="acc-gate__id">' + g.id + '</span><span><span class="acc-gate__name">' + esc(g.name) + '</span><span class="acc-gate__d">' + esc(g.d) + '</span></span>' +
          c.toggle({ id: 'gate-' + g.key, label: st.on ? 'On' : 'Off', checked: st.on, attrs: 'data-bind' }) +
          '<div class="acc-gate__params">' + (st.on ? c.field(g.param[0], c.input({ id: 'gate-' + g.key + '-v', value: st.v, mono: true, attrs: 'data-bind', invalid: !!E('gate-' + g.key + '-v') }), { id: 'gate-' + g.key + '-v', error: E('gate-' + g.key + '-v') })
            : c.field('Decision record', c.input({ id: 'gate-' + g.key + '-adr', value: st.adr, mono: true, placeholder: 'ADR-0031', attrs: 'data-bind', invalid: !!E('gate-' + g.key + '-adr') }), { id: 'gate-' + g.key + '-adr', required: true, error: E('gate-' + g.key + '-adr'), help: 'Why this gate is off. Lint LN-07 flags it otherwise.' })) + '</div></li>';
      }).join('') + '</ol>' +
      c.callout({ kind: 'rule', title: 'When a gate fails', body: '<p>The first failure sets the refusal code, and the remaining gates still run and record, so an operator sees every problem at once. A missing gate result is a failure, never a pass. There is no warn: escalate is the honest version of warn.</p>' }) +
      '<p class="e1-caption e1-muted acc-mt">Declared order for erp.sales_invoice.submit: consent, residency, retention, counterparty, precondition, dual control, budget. <a class="acc-link" href="#/records/write-types/erp.sales_invoice.submit">See the write type</a></p>');
  };

  R.people = function (s) {
    var rows = s.people.map(function (p, i) {
      var set = RESOLVER_SETS.filter(function (r) { return r.id === p.set; })[0] || RESOLVER_SETS[3];
      return '<tr><th scope="row">' + c.actor({ name: p.name, kind: 'person', role: p.role, size: 'sm' }) + '</th><td class="e1-mono e1-caption">' + esc(p.email) + '</td><td>' + (p.set === 'none' ? '<span class="e1-muted">' + esc(set.label) + '</span>' : c.chip(set.label, { icon: 'users' })) + '<span class="acc-cellnote" style="text-align:left">' + esc(set.what) + '</span></td>' +
        '<td style="text-align:right">' + c.button('Remove ' + p.name, { kind: 'ghost', size: 'sm', iconOnly: true, icon: 'trash', attrs: 'data-action="acc-ppl-rm" data-value="' + i + '"' }) + '</td></tr>';
    }).join('');
    return stepFrame('people', 'Who may approve', 'Invite the people who decide. Resolver sets contain humans only: an agent can never approve, and nobody approves their own proposal.',
      '<div class="e1-table-wrap" id="ppl-table"><table class="e1-table acc-people"><caption class="e1-sr">People invited to this tenant</caption><thead><tr><th scope="col">Person</th><th scope="col">E-mail</th><th scope="col">Resolver set</th><th scope="col"><span class="e1-sr">Actions</span></th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="4">' + c.empty({ title: 'Nobody is invited yet', why: 'Without people there is nobody to approve the writes that need one, so every such write would expire.', fill: 'Add at least one person to each resolver set, and two owners.', compact: true, icon: 'users' }) + '</td></tr>') + '</tbody></table></div>' +
      (E('ppl-table') ? '<p class="e1-field__error" role="alert">' + c.icon('alert', 12) + '<span>' + esc(E('ppl-table')) + '</span></p>' : '') +
      (E('ppl-owners') ? '<p class="e1-field__error" role="alert" id="ppl-owners">' + c.icon('alert', 12) + '<span>' + esc(E('ppl-owners')) + '</span></p>' : '') +
      '<div class="acc-panel acc-mt"><h2 class="acc-panel__h">Add a person</h2><p class="acc-panel__lead">They get an invitation when you finish setup, naming the tenant, their role and exactly what they may approve.</p>' +
      '<div class="acc-addrow">' +
      c.field('Name', c.input({ id: 'ppl-name', placeholder: 'Priya Deshpande' }), { id: 'ppl-name' }) +
      c.field('Work e-mail', c.input({ id: 'ppl-email', type: 'email', placeholder: 'name@sahyadriagro.in' }), { id: 'ppl-email' }) +
      c.field('Kind', c.select({ id: 'ppl-kind', options: [{ value: 'person', label: 'Person' }, { value: 'agent', label: 'Agent — never in a resolver set' }], value: 'person' }), { id: 'ppl-kind' }) +
      c.field('Resolver set', c.select({ id: 'ppl-set', options: RESOLVER_SETS.map(function (r) { return { value: r.id, label: r.label }; }), value: 'ar-approvers' }), { id: 'ppl-set' }) +
      '<div class="e1-field"><span class="e1-field__label" aria-hidden="true">&nbsp;</span>' + c.button('Add', { kind: 'secondary', icon: 'plus', attrs: 'data-action="acc-ppl-add"' }) + '</div></div>' +
      '<p class="e1-field__error" id="ppl-add-msg" role="alert" hidden></p>' +
      '<p class="e1-caption e1-muted" style="margin-top:8px">Try adding “ar-agent”, choosing Agent, or accounts@ to see what we say. <a class="acc-link" href="#/auth/invite/inv-SAH-2P9L">Preview the invitation e-mail’s page</a></p></div>');
  };
  E1.action('acc-ppl-add', function () {
    var name = val('ppl-name'), email = val('ppl-email'), kind = val('ppl-kind'), set = val('ppl-set'), msg = document.getElementById('ppl-add-msg');
    function bad(t) { msg.innerHTML = c.icon('alert', 12) + '<span>' + esc(t) + '</span>'; msg.hidden = false; }
    if (kind === 'agent' || AGENT_RE.test(name) || AGENT_RE.test((email || '').split('@')[0])) return bad('Resolver sets contain humans only. An agent can never approve; register it in the next step instead.');
    if (name.split(/\s+/).filter(Boolean).length < 2) return bad('Enter the person’s first and last name.');
    if (!EMAIL_RE.test(email)) return bad('Enter an e-mail address like name@sahyadriagro.in.');
    if (LIST_RE.test(email)) return bad('Give us a person, not a distribution list.');
    var s = S();
    if (s.people.some(function (p) { return p.email.toLowerCase() === email.toLowerCase(); })) return bad(email + ' is already on the list.');
    s.people.push({ name: name, email: email, role: 'Invited', set: set }); save(s);
    if (errStep === 'people') { errs = VALIDATE.people(s); }
    E1.render({ keepScroll: true }); E1.toast(name + ' added to ' + set + '.', 'good');
  });
  E1.action('acc-ppl-rm', function (el) {
    var s = S(), i = Number(el.getAttribute('data-value')), p = s.people[i]; if (!p) return;
    s.people.splice(i, 1); save(s); E1.render({ keepScroll: true }); E1.toast(p.name + ' removed. No invitation will be sent.', 'neutral');
  });

  function codeFor(s) {
    var n = s.agent.name || 'invoice-drafter', sp = 'act_hum_' + String(s.agent.sponsor || 'shalini deshmukh').toLowerCase().replace(/\s+/g, '_');
    return {
      ts: 'import { KernelClient } from "@elan1/kernel";\n\nconst k = new KernelClient({ token: process.env.ELAN1_SANDBOX_TOKEN!, port: "v1" });\n\n// 1. Register the agent. It starts at A0 Observe (no grant).\nconst agent = await k.actors.register({\n  name: "' + n + '",\n  kind: "agent",\n  sponsor: "' + sp + '",   // the person behind the agent\n  model: "' + (s.agent.model || 'claude-sonnet') + '",\n  tools: ["read.records", "stage.write", "act.write"],\n});\n\n// 2. Stage first: validated, no side effects.\nconst staged = await k.stage({\n  write_type: "erp.sales_invoice.submit",\n  declaration_version: 1,          // explicit integer, never "latest"\n  payload, as_of: businessInstant,\n});\n\n// 3. Then act. Three outcomes, all HTTP 200.\nconst res = await k.assert({ ...staged.request, idempotency_key: invoiceKey });\nswitch (res.outcome) {\n  case "committed": return showDone(res.record.seq, res.undo_until);\n  case "escalated": return awaitObligation(res.decision.obligation!.obligation_id);\n  case "refused":   return res.decision.code.startsWith("PLATFORM.")\n    ? retryLater(res)            // our failure: same key\n    : showOperatorAction(res);   // never retry a governed refusal\n}',
      py: 'from elan1_kernelport import KernelClient, Committed, Escalated, Refused\n\nk = KernelClient(token=sandbox_token, port="v1", timeout_s=5.0)\n\nagent = k.actors.register(\n    name="' + n + '", kind="agent",\n    sponsor="' + sp + '",       # the person behind the agent\n    model="' + (s.agent.model || 'claude-sonnet') + '",\n    tools=["read.records", "stage.write", "act.write"],\n)   # starts at A0 Observe (no grant)\n\nres = k.assert_(intent)   # wire name is assert\nmatch res:\n    case Committed(record=r, undo_until=u):\n        return {"seq": r.seq, "undo_until": u}\n    case Escalated(decision=d):\n        return {"await": d.obligation.obligation_id}\n    case Refused(decision=d) if d.code.startswith("PLATFORM."):\n        raise RetryableKernelFailure(d.code)   # same idempotency key\n    case Refused(decision=d):\n        return {"refused": d.code, "action": res.operator_action}',
      mcp: '{\n  "mcpServers": {\n    "elan1": {\n      "url": "https://mcp.in.elan1.example/v1",\n      "auth": {\n        "type": "oauth2.1-client-credentials",\n        "client_id": "agt_' + n.replace(/-/g, '_') + '",\n        "client_secret_env": "ELAN1_AGENT_SECRET"\n      }\n    }\n  }\n}\n\n// Static keys are not accepted on MCP: the client exchanges\n// its credentials for a short-lived tenant token.\n// tools/list returns 34 tools (18 ro · 10 stage · 6 act), each with\n// _meta: elan1/declaration, elan1/description_sha256, elan1/scope.\n// A refusal returns isError: false — do not retry it.'
    };
  }
  R.agents = function (s) {
    var cd = codeFor(s), via = s.agent.via || 'sdk';
    var ppl = s.people.map(function (p) { return p.name; });
    return stepFrame('agents', 'Register your first agent', 'Agents reach elan1 through the SDK or over MCP. Every agent has a person behind it, and starts with no grant.',
      '<div class="acc-panel"><div class="acc-fgrid">' +
      c.field('Agent name', c.input({ id: 'ag-name', value: s.agent.name, mono: true, attrs: 'data-bind', invalid: !!E('ag-name') }), { id: 'ag-name', required: true, error: E('ag-name') }) +
      c.field('Sponsor', c.select({ id: 'ag-sponsor', options: [{ value: '', label: 'Choose a person' }].concat(ppl.map(function (x) { return { value: x, label: x }; })), value: s.agent.sponsor, attrs: 'data-bind', invalid: !!E('ag-sponsor') }), { id: 'ag-sponsor', required: true, error: E('ag-sponsor'), help: 'The person behind the agent. An agent token with no sponsor is refused.' }) +
      c.field('Model', c.input({ id: 'ag-model', value: s.agent.model, mono: true, attrs: 'data-bind' }), { id: 'ag-model', optional: true, help: 'Recorded beside the agent; never in the decision path.' }) +
      '<div class="e1-field"><span class="e1-field__label">Connects through</span><div class="acc-opts acc-opts--2" role="radiogroup" aria-label="Connects through" id="ag-via">' +
      opt('ag-via', 'sdk', via, { t: 'SDK', icon: 'code', d: 'TypeScript or Python, in-process.' }) + opt('ag-via', 'mcp', via, { t: 'MCP', icon: 'plug', d: 'Tool calls over MCP 2026-07-28.' }) + '</div></div>' +
      '</div>' +
      '<div class="acc-note acc-mt">' + c.icon('info', 16) + '<span>' + c.autonomy(null, { compact: true }) + ' is where every agent starts. There is no API that sets an autonomy level; raising a grant is itself a governed write.</span></div>' +
      '<div class="acc-mt">' + c.toggle({ id: 'ag-grant', label: 'For the sandbox proof, request A2 Propose on erp.sales_invoice.submit', note: 'Sandbox tenant only, approved by ' + (s.people.filter(function (p) { return p.set === 'owners'; })[0] || { name: 'an owner' }).name + '. Production grants start again at A0.', checked: s.agent.sandboxGrant, attrs: 'data-bind' }) + '</div></div>' +
      '<div class="acc-panel"><div class="acc-inline" style="justify-content:space-between;margin-bottom:12px"><h2 class="acc-panel__h" style="margin:0">' + (via === 'mcp' ? 'MCP client configuration' : 'Register and make a first call') + '</h2>' +
      (via === 'sdk' ? c.segmented([{ id: 'ts', label: 'TypeScript' }, { id: 'py', label: 'Python' }], 'ts', { name: 'acc-lang', label: 'Language', size: 'sm' }) : '') + '</div>' +
      (via === 'mcp' ? c.code(cd.mcp, 'json', { title: 'mcp.json · illustrative' }) :
        '<div class="acc-codepanel" data-lang="ts">' + c.code(cd.ts, 'ts', { title: 'agent.ts · illustrative' }) + '</div><div class="acc-codepanel" data-lang="py" hidden>' + c.code(cd.py, 'python', { title: 'agent.py · illustrative' }) + '</div>') +
      '<p class="e1-caption e1-muted" style="margin-top:8px">Snippets are illustrative until the SDK reaches GA. <a class="acc-link" href="#/developers/' + (via === 'mcp' ? 'mcp' : 'sdk/typescript') + '">Full reference</a></p>' +
      '<div class="acc-mt" id="ag-register">' + (s.agent.registered
        ? '<div class="acc-note acc-note--good">' + c.icon('check', 16) + '<span><strong>' + esc(s.agent.name) + ' is registered</strong> in the sandbox tenant as <span class="e1-mono">act_agt_' + esc(s.agent.name.replace(/-/g, '_')) + '</span>, sponsor ' + esc(s.agent.sponsor) + '. Three tool descriptions are hash-pinned; a changed description shows as a version change, not a silent update.</span></div>'
        : '<div class="acc-inline">' + c.button('Register in the sandbox tenant', { kind: 'primary', icon: 'agents', attrs: 'data-action="acc-ag-register"' }) + '<span class="e1-caption e1-muted">Or run the snippet; this page notices the registration.</span></div>' +
          (E('ag-register') ? '<p class="e1-field__error" role="alert" style="margin-top:8px">' + c.icon('alert', 12) + '<span>' + esc(E('ag-register')) + '</span></p>' : '')) + '</div></div>');
  };
  E1.on('e1:change', '.acc-wz [data-name="acc-lang"]', function (e, el) {
    var v = e.detail && e.detail.value; if (!v) return;
    Array.prototype.forEach.call(document.querySelectorAll('.acc-codepanel'), function (p) { p.hidden = p.getAttribute('data-lang') !== v; });
  });
  E1.action('acc-ag-register', function (el) {
    var s = S(); COLLECT.agents(s); save(s);
    var e = VALIDATE.agents(s); delete e['ag-register'];
    if (Object.keys(e).length) { errs = e; errStep = 'agents'; return E1.render({ keepScroll: true }); }
    el.classList.add('is-loading');
    setTimeout(function () { var s2 = S(); s2.agent.registered = true; save(s2); if (errStep === 'agents') errs = {}; E1.render({ keepScroll: true }); E1.toast(s2.agent.name + ' registered at A0 Observe (no grant).' + (s2.agent.sandboxGrant ? ' A2 Propose requested for the sandbox tenant.' : ''), 'good', { title: 'Agent registered' }); }, reducedMotion() ? 50 : 900);
  });

  /* Sandbox proof: three outcomes with the nine rungs animated */
  function runs(s) {
    var ag = s.agent.name || 'invoice-drafter', appr = (s.people.filter(function (p) { return p.set === 'ar-approvers'; })[0] || { name: 'Shalini Deshmukh' }).name;
    var proposer = (s.people.filter(function (p) { return p.set === 'none'; })[0] || { name: 'Rohit Patil' }).name;
    return {
      committed: { t: 'Committed', title: 'Submit invoice SINV-SBX-0001 · Godavari Traders · ₹84,000', by: proposer + ' (person, web console)', outcome: 'committed', at: 9, seq: 1, res: 'Committed · proof #1 · reversible for 24 h (cancel IRN) · metered at quantity zero in the sandbox tenant' },
      refused: { t: 'Not done', title: 'Submit invoice SINV-SBX-0002 · Konkan Cold Storage · ₹4,20,000', by: ag + ' (agent, A2 Propose)', outcome: 'refused', at: 3, seq: 2, code: 'GATE.PRECONDITION_FAILED', res: 'Not done — credit limit · exposure after this invoice ₹4,20,000 against a limit of ₹3,00,000 · proof #2 · metered at ₹0', notes: { 3: 'G9 precondition failed: credit limit' } },
      escalated: { t: 'Waiting on a person', title: 'Submit invoice SINV-SBX-0003 · Godavari Traders · ₹2,40,000', by: ag + ' (agent, A2 Propose)', outcome: 'escalated', at: 6, seq: 3, res: 'Waiting on ' + appr + ' (ar-approvers) · obligation OB-SBX-0001 · expires in 4 h · proof #3', appr: appr }
    };
  }
  R['sandbox-proof'] = function (s) {
    var rr = runs(s), P = s.proof;
    function runCard(k) {
      var r = rr[k], done = k === 'escalated' ? P.escalated : P[k];
      var rungs = done ? c.rungs({ outcome: k === 'escalated' && P.resolved ? 'committed' : r.outcome, at: r.at, compact: true }) : c.rungs({ outcome: 'running', at: 0, compact: true });
      var head = '<div class="acc-run__head"><span><span class="acc-run__t">' + esc(r.title) + '</span><span class="acc-run__d">Proposed by ' + esc(r.by) + ' · erp.sales_invoice.submit · mode: sandbox</span></span>' +
        (done ? c.outcome(k === 'escalated' && P.resolved ? 'committed' : r.outcome, { code: r.code }) : c.button('Run this write', { kind: 'secondary', size: 'sm', icon: 'play', attrs: 'data-action="acc-run" data-value="' + k + '"' })) + '</div>';
      var res = done ? '<div class="acc-run__res"><span>' + esc(k === 'escalated' && P.resolved ? 'Approved by ' + r.appr + ' at proof #4 · resubmitted, committed at proof #5' : r.res) + '</span>' +
        (k === 'escalated' && !P.resolved ? c.button('Approve as ' + r.appr, { kind: 'gate', size: 'sm', attrs: 'data-action="acc-resolve"' }) : '') +
        (k === 'refused' ? '<a class="acc-link" href="#/developers/refusals/GATE.PRECONDITION_FAILED">What this refusal means</a>' : '') + '</div>' : '';
      return '<div class="acc-run" id="run-' + k + '">' + head + '<div class="acc-rungs-slot" data-run="' + k + '">' + rungs + '</div>' + res + '</div>';
    }
    var entries = [];
    if (P.committed) entries.push({ seq: 1, outcome: 'committed', writeType: 'erp.sales_invoice.submit', actorKind: 'person' });
    if (P.refused) entries.push({ seq: 2, outcome: 'refused', writeType: 'erp.sales_invoice.submit', actorKind: 'agent' });
    if (P.escalated) entries.push({ seq: 3, outcome: 'escalated', writeType: 'erp.sales_invoice.submit', actorKind: 'agent' });
    if (P.resolved) { entries.push({ seq: 4, outcome: 'committed', writeType: 'platform.obligation.resolve', actorKind: 'person' }); entries.push({ seq: 5, outcome: 'committed', writeType: 'erp.sales_invoice.submit', actorKind: 'agent' }); }
    var prev = '0000000000000000000000000000000000000000000000000000000000000000';
    entries.sort(function (a, b) { return b.seq - a.seq; });
    entries.slice().reverse().forEach(function (e) { e.prev = prev; e.digest = hx('sbx' + e.seq + e.writeType, 64); prev = e.digest; e.at = fmt.time(E1.ago(12 - e.seq)); });
    var n = ['committed', 'refused', 'resolved'].filter(function (k) { return P[k]; }).length;
    return stepFrame('sandbox-proof', 'Prove it in the sandbox tenant', 'Run one governed write for each outcome and watch it climb the nine rungs. The production review asks for all three, including a real refusal and a real escalation resolved by a real human.',
      '<div class="acc-inline" style="margin-bottom:16px">' + c.progress(n, 3, { label: 'Outcomes proved', state: n === 3 ? 'good' : 'accent', note: n + ' of 3' }) + '</div>' +
      runCard('committed') + runCard('refused') + runCard('escalated') +
      (E('run-committed') || E('run-refused') || E('run-escalated') ? '<p class="e1-field__error" role="alert" style="margin-top:8px">' + c.icon('alert', 12) + '<span>Prove all three outcomes before you continue.</span></p>' : '') +
      '<div class="acc-panel acc-mt"><div class="acc-inline" style="justify-content:space-between;margin-bottom:12px"><h2 class="acc-panel__h" style="margin:0">Your sandbox chain</h2>' +
      c.button(P.replay ? 'Replay checked' : 'Replay #1 with the same idempotency key', { kind: 'ghost', size: 'sm', icon: P.replay ? 'check' : 'refresh', attrs: 'data-action="acc-replay"' + (P.committed && !P.replay ? '' : ' disabled') }) + '</div>' +
      (entries.length ? c.chain(entries, { standing: 'continuous', scope: 'sandbox tenant · mode: sandbox', count: entries.length + (entries.length === 1 ? ' entry' : ' entries'), checkedAt: fmt.time(new Date()) })
        : c.empty({ title: 'No entries yet', why: 'The sandbox chain starts at #1 with the first governed write, committed or not.', fill: 'Run a write above. Refusals and escalations are recorded too.', compact: true, icon: 'chain' })) +
      '<p class="e1-caption e1-muted" style="margin-top:8px">Sandbox entries are marked mode: sandbox and can never be presented as production ones.</p></div>');
  };
  var running = false;
  E1.action('acc-run', function (el) {
    if (running) return;
    var k = el.getAttribute('data-value'), s = S(), r = runs(s)[k];
    var slot = document.querySelector('.acc-rungs-slot[data-run="' + k + '"]');
    function finish() {
      running = false;
      var s2 = S();
      if (k === 'escalated') s2.proof.escalated = true; else s2.proof[k] = true;
      save(s2); if (errStep === 'sandbox-proof') errs = VALIDATE['sandbox-proof'](s2);
      E1.render({ keepScroll: true }); refreshSummary();
      E1.toast(r.res, k === 'committed' ? 'good' : k === 'refused' ? 'neutral' : 'warning', { title: r.t });
    }
    if (!slot || reducedMotion()) return finish();
    running = true; el.classList.add('is-loading'); el.setAttribute('aria-busy', 'true');
    var i = 0;
    var tm = setInterval(function () {
      i++;
      if (!document.body.contains(slot)) { clearInterval(tm); running = false; return; }
      if (i < r.at) slot.innerHTML = c.rungs({ outcome: 'running', at: i + 1, compact: true });
      else { clearInterval(tm); slot.innerHTML = c.rungs({ outcome: r.outcome, at: r.at, compact: true }); setTimeout(finish, 450); }
    }, 280);
  });
  E1.action('acc-resolve', function () {
    var s = S(), r = runs(s).escalated;
    E1.confirm({ eyebrow: 'Decide · OB-SBX-0001', title: 'Approve as ' + r.appr + '?', kind: 'gate', confirmLabel: 'Approve and commit',
      body: '<p>' + esc(r.title) + '.</p><p>Gates 5 of 5 passed. Dual control applies above ₹2,00,000; ' + esc(r.appr) + ' is the second named person. In the sandbox tenant this is still a real approval by a real person, recorded as proof #4.</p>',
      onConfirm: function () {
        var s2 = S(); s2.proof.resolved = true; save(s2); if (errStep === 'sandbox-proof') errs = VALIDATE['sandbox-proof'](s2);
        E1.render({ keepScroll: true });
        var slot = document.querySelector('.acc-rungs-slot[data-run="escalated"]');
        if (slot && !reducedMotion()) { var i = 5; slot.innerHTML = c.rungs({ outcome: 'running', at: 6, compact: true }); var tm = setInterval(function () { i++; if (!document.body.contains(slot)) return clearInterval(tm); if (i < 9) slot.innerHTML = c.rungs({ outcome: 'running', at: i + 1, compact: true }); else { clearInterval(tm); slot.innerHTML = c.rungs({ outcome: 'committed', compact: true }); } }, 280); }
        E1.toast('Approved by ' + r.appr + ' at #4. The resubmission committed at #5.', 'good', { title: 'Committed' });
      } });
  });
  E1.action('acc-replay', function () {
    var s = S(); s.proof.replay = true; save(s); E1.render({ keepScroll: true });
    E1.toast('Replayed with idempotency key sbx-inv-0001: the original proof #1 came back. No new entry, no meter event.', 'good', { title: 'Idempotency checked' });
  });

  R.production = function (s) {
    var P = s.proof, owners = s.people.map(function (p) { return p.name; });
    var checks = [
      ['Enforcement mode stated in writing', MODES[s.system.mode].t + ', and it matches channels[].mode in the declaration', s.done.system && s.system.tested ? 'passed' : 'not_done', '#/onboarding/system'],
      ['Every write type has a reversal plan or an explicit irreversible flag', '6 of 6 write types in ' + (PACKS[s.pack] || PACKS.none).decl + ' v1', s.done.declaration ? 'passed' : 'not_checked', '#/onboarding/declaration'],
      ['All three outcomes proved in the sandbox tenant', 'Including a real refusal and a real escalation resolved by a real human', P.committed && P.refused && P.resolved ? 'passed' : 'not_done', '#/onboarding/sandbox-proof'],
      ['A named person certified the declaration', s.decl.certified ? 'Certified by ' + s.decl.certifier + ' at version 1' : 'Not certified yet', s.decl.certified ? 'passed' : 'not_done', '#/onboarding/declaration']
    ];
    var W = { passed: ['good', 'Passed', 'check'], not_done: ['neutral', 'Not done', 'minus'], not_checked: ['neutral', 'Not checked', 'skip'] };
    var ready = checks.every(function (x) { return x[2] === 'passed'; });
    var body;
    if (s.production.submitted) {
      body = '<div class="acc-panel"><div class="acc-inline" style="justify-content:space-between"><h2 class="acc-panel__h" style="margin:0">Request ' + esc(s.production.id) + '</h2>' + c.badge('info', 'In review', { icon: 'clock' }) + '</div>' +
        '<p class="acc-panel__lead" style="margin-top:4px">A person reads this. Two working days. Sent ' + esc(fmt.dateTime(s.production.at)) + '.</p>' +
        c.stepper([{ label: 'Submitted', note: fmt.time(s.production.at) }, { label: 'In review', note: 'The four checks' }, { label: 'Approved or refused', note: 'With a sentence' }], 1) +
        '<p class="acc-mt">If approved, the <span class="e1-mono">sk_live_…</span> key is shown once to ' + esc(s.production.owner) + ', scoped to this tenant, your declared write types and residency domain in. If refused, you get the sentence that says why and what would change it.</p>' +
        '<div class="acc-inline acc-mt">' + c.button('Where reviews happen', { kind: 'ghost', href: '#/work/reviews', iconRight: 'arrow-right' }) + c.button('Keys in the Agents door', { kind: 'ghost', href: '#/agents/keys', iconRight: 'arrow-right' }) + '</div></div>';
    } else {
      body = '<div class="acc-panel"><h2 class="acc-panel__h">The four checks, and only four</h2><p class="acc-panel__lead">The reviewer reads exactly these. Nothing else is asked.</p><ul class="acc-checks" role="list">' + checks.map(function (x) {
        var w = W[x[2]];
        return '<li class="acc-check"><span class="e1-tone--' + w[0] + '">' + c.icon(w[2], 16) + '</span><span><span class="acc-check__t">' + esc(x[0]) + '</span><span class="acc-check__d">' + esc(x[1]) + (x[2] !== 'passed' ? ' · <a class="acc-link" href="' + x[3] + '">Fix this</a>' : '') + '</span></span>' + c.badge(w[0], w[1], { subtle: true }) + '</li>';
      }).join('') + '</ul></div>' +
        '<div class="acc-panel"><h2 class="acc-panel__h">Attach and send</h2><div class="acc-fgrid">' +
        c.field('Production owner', c.select({ id: 'prod-owner', options: owners, value: s.production.owner, attrs: 'data-bind' }), { id: 'prod-owner', help: 'A person, not a distribution list. They receive the key.' }) +
        c.field('Residency domain', c.input({ id: 'prod-dom', value: 'in · Mumbai (ap-south-1)', readonly: true }), { id: 'prod-dom' }) +
        '<div class="is-wide e1-field"><span class="e1-field__label">Conformance result file</span>' + (s.production.file
          ? '<div class="acc-note acc-note--good">' + c.icon('file', 16) + '<span><strong>conformance-result.json</strong> · C1–C14 · 14 of 14 passed · run against the reference tenant ' + esc(fmt.dateTime(E1.ago(40))) + '</span></div>'
          : '<div class="acc-inline">' + c.button('Attach result file', { kind: 'secondary', icon: 'upload', attrs: 'data-action="acc-prod-file"' }) + '<a class="e1-caption acc-link" href="#/developers/conformance">How to run the suite</a></div>') + '</div></div>' +
        '<div class="acc-inline acc-mt">' + c.button('Send for review', { kind: 'primary', icon: 'send', attrs: 'data-action="acc-prod-send"' }) + '<span class="e1-caption e1-muted">' + (ready ? 'All four checks pass.' : 'You can send now; the reviewer will see what is not done.') + '</span></div>' +
        (E('prod-send') ? '<p class="e1-field__error" role="alert" style="margin-top:8px">' + c.icon('alert', 12) + '<span>' + esc(E('prod-send')) + '</span></p>' : '') + '</div>';
    }
    return stepFrame('production', 'Request a production key', 'A production key is a credential to somebody’s books, and there is no honest way to issue one without a human reading what the applicant declared.',
      c.callout({ kind: 'rule', title: 'Production keys are issued by us, never self-serve in Phase 1', body: '<p>Your sandbox key keeps working meanwhile. A production key still uses the shadow sandbox on every write.</p>' }) + '<div class="acc-mt">' + body + '</div>' +
      (s.production.submitted ? '' : '<p class="e1-caption acc-mt"><a class="acc-link" href="#/onboarding/done" data-action="acc-skip-prod">Finish without requesting a key; keep working in the sandbox tenant</a></p>'),
      {});
  };
  E1.action('acc-prod-file', function () { var s = S(); s.production.file = true; save(s); E1.render({ keepScroll: true }); E1.toast('conformance-result.json attached: 14 of 14.', 'good'); });
  E1.action('acc-prod-send', function () {
    var s = S(); COLLECT.production(s);
    if (!s.production.file) { save(s); errs = { 'prod-send': 'Attach the conformance result file first. The reviewer checks it against the declaration version.' }; errStep = 'production'; return E1.render({ keepScroll: true }); }
    s.production.submitted = true; s.production.id = 'PR-0043'; s.production.at = new Date().toISOString(); save(s); errs = {}; errStep = null;
    E1.render({ keepScroll: true }); refreshSummary();
    E1.toast('A person reads this. Two working days.', 'good', { title: 'PR-0043 sent for review' });
  });
  E1.action('acc-skip-prod', function () { var s = S(); s.done.production = true; save(s); errs = {}; errStep = null; E1.go('/onboarding/done'); });

  R.done = function (s) {
    var n = doneCount(s), all = STEPS.filter(function (x) { return x.id !== 'done' && !s.done[x.id]; });
    var doors = [
      ['work', 'Work', 'What needs me now?', '#/work/today', 'Approvals waiting on your people'],
      ['records', 'Records', 'What changed, and what may change?', '#/records/declarations', 'Your declaration and write types'],
      ['agents', 'Agents', 'Who may act, and at what level?', '#/agents/registry', s.agent.name + ' and its grants'],
      ['assurance', 'Assurance', 'What can we truthfully claim?', '#/assurance', 'Chain standing and the L1 claim']
    ];
    return stepFrame('done', all.length ? 'Almost there' : 'Your sandbox tenant is ready', all.length ? esc(all.length) + ' step' + (all.length === 1 ? ' is' : 's are') + ' still open. You can explore the console now and come back.' : 'Setup is complete. Here is what happens next, and where everything lives.',
      (all.length ? '<div class="acc-note acc-note--warning" style="margin-bottom:16px">' + c.icon('info', 16) + '<span>Still open: ' + all.map(function (x) { return '<a class="acc-link" href="#/onboarding/' + x.id + '">' + esc(x.label) + '</a>'; }).join(', ') + '.</span></div>' : '') +
      '<div class="acc-panel"><div class="acc-inline" style="justify-content:space-between"><h2 class="acc-panel__h" style="margin:0">What you can claim today</h2>' + c.level('L1') + '</div>' +
      '<p class="acc-sentence acc-mt">At L1, elan1 decides whether a write is permitted, forces a human to approve the writes that need it, executes it through a single writer, records the decision in a hash-chained append-only log, and meters it. The log is tamper-evident. It is not yet signed, not yet anchored to an external time source, and not yet verifiable by a third party who does not trust us.</p></div>' +
      c.section({ id: 'next', title: 'Next steps', body: '<ol class="acc-plan" role="list">' +
        [['Production review', s.production.submitted ? s.production.id + ' is with a person. Two working days.' : 'Not requested yet. You can request it any time.', s.production.submitted ? '#/work/reviews' : '#/onboarding/production'],
          ['Invitations', s.people.length + ' people get an invitation now, naming what they may approve.', '#/agents/people'],
          ['Your first real write', 'After the key is issued, the same code runs against ERPNext; the first entry is proof #1 of your production chain.', '#/developers/quickstart'],
          ['A pilot with your auditor', '90 days, one auditor. Day 0 is half a day with them and three questions.', '#/auditors']].map(function (x, i) {
          return '<li><span class="acc-plan__n">' + (i + 1) + '</span><span><strong>' + esc(x[0]) + '</strong><br><span class="e1-caption e1-muted">' + esc(x[1]) + '</span></span><a class="e1-caption acc-link" href="' + x[2] + '">Open</a></li>';
        }).join('') + '</ol>' }) +
      c.section({ id: 'doors', title: 'Four doors', lead: 'Everything in the console sits behind one of these. There is no fifth door and no Settings.', body: '<div class="acc-doors">' + doors.map(function (d) {
        return '<a class="acc-door" href="' + d[3] + '">' + c.icon(E1.nav[d[0]].icon, 20) + '<b>' + esc(d[1]) + '</b><span>' + esc(d[2]) + '</span><span>' + esc(d[4]) + '</span><em>Open ' + esc(d[1]) + ' →</em></a>';
      }).join('') + '</div>' }),
      { next: 'Go to the console', hint: n + ' of 11 steps done' });
  };

  E1.route('/onboarding/:step', {
    title: function (p) { var i = stepIdx(p.step); return i >= 0 ? 'Setup · ' + STEPS[i].label : 'Setup'; },
    layout: 'wizard', example: '/onboarding/organisation', keywords: 'onboarding setup step wizard',
    render: function (p) {
      var i = stepIdx(p.step), s = S();
      if (i < 0) {
        return '<div class="acc-step">' + c.pageHeader({ eyebrow: 'Setup', title: 'There is no setup step called “' + p.step + '”' }) + c.empty({ title: 'This step does not exist', why: 'Setup has eleven steps, from Organisation to Done. The link may be from an older version.', action: { label: 'Back to the start', href: '#/onboarding' } }) + '</div>';
      }
      if (errStep && errStep !== p.step) { errs = {}; errStep = null; }
      return R[p.step](s);
    },
  });
  STEPS.forEach(function (x, i) { E1.cmdAdd({ id: 'acc-onb-' + x.id, label: 'Setup step ' + (i + 1) + ': ' + x.label, run: '#/onboarding/' + x.id, icon: 'check', group: 'Setup', keywords: 'onboarding ' + x.note }); });

  /* ========================================================================
     ACCOUNT (layout 'console', no door)
     ======================================================================== */
  function accTabs(active) {
    return c.tabs([{ id: 'profile', label: 'Profile', href: '#/account/profile' }, { id: 'preferences', label: 'Preferences', href: '#/account/preferences' }, { id: 'sessions', label: 'Sessions', href: '#/account/sessions' }, { id: 'notifications', label: 'Notifications', href: '#/account/notifications' }], active, { label: 'Account' });
  }
  var ACC = { title: '', layout: 'console', crumbs: [['Account', '#/account/profile']] };
  function acc(path, title, section, render, extra) { E1.route(path, Object.assign({}, ACC, { title: title, render: render, keywords: 'account ' + section }, extra || {})); }
  function prefs() { return E1.store.get('access.prefs', { lang: 'en', email: true, push: true }) || { lang: 'en' }; }
  function wa() { return E1.store.get('access.wa', { on: false, phone: '+91 98430 12345', ledger: [] }) || { on: false, ledger: [] }; }

  acc('/account/profile', 'Profile', 'profile', function (p, qy) {
    var u = E1.data.user, t = E1.tenant ? E1.tenant() : E1.data.tenants[0];
    var removed = E1.store.get('access.methods.rm', []) || [];
    var methods = [
      { id: 'pk1', kind: 'Passkey', name: 'MacBook Pro (Touch ID)', added: E1.ago(60 * 24 * 53), used: E1.ago(95), icon: 'fingerprint' },
      { id: 'pk2', kind: 'Passkey', name: 'iPhone 15 (Face ID)', added: E1.ago(60 * 24 * 40), used: E1.ago(130), icon: 'fingerprint' },
      { id: 'totp', kind: 'Authenticator app', name: 'Microsoft Authenticator', added: E1.ago(60 * 24 * 53), used: E1.ago(60 * 24 * 2), icon: 'clock' },
      { id: 'bk', kind: 'Backup codes', name: '8 of 10 left', added: E1.ago(60 * 24 * 53), used: E1.ago(60 * 24 * 30), icon: 'key' }
    ].filter(function (m) { return removed.indexOf(m.id) < 0; });
    return c.pageHeader({ eyebrow: 'Account', title: u.name, lead: 'Who you are to the platform: your identity, what you may approve, how you sign in, and the agents you answer for.', actions: c.button('Edit profile', { icon: 'edit', attrs: 'data-action="acc-edit-profile"' }) + c.button('Sign out', { kind: 'ghost', icon: 'log-out', href: '#/auth/signed-out' }) }) +
      accTabs('profile') +
      '<div class="e1-grid e1-grid--2">' +
      c.card({ title: 'Identity', body: '<div class="e1-row" style="gap:16px;margin-bottom:16px">' + c.avatar(u.name, { kind: 'person', size: 'xl' }) + '<div><div class="e1-text-section">' + esc(u.name) + '</div><div class="e1-muted">' + esc(u.role) + ' · ' + esc(t.name) + '</div></div></div>' +
        c.kv([['E-mail', u.email, { mono: true }], ['Actor id', u.actorId, { mono: true }], ['Actor kind', 'Person — set by the kernel, never claimed'], ['Tenant', t.name + ' · ' + t.residency], ['Member since', fmt.date(E1.ago(60 * 24 * 53))]], { compact: true }) }) +
      c.card({ title: 'What you may approve', actions: '<a class="e1-caption acc-link" href="#/agents/roles">Roles</a>', body: '<div class="acc-chips" style="margin-bottom:12px">' + u.resolverSets.map(function (s) { return c.chip(s, { icon: 'users' }); }).join('') + c.badge('neutral', 'Payment authority: dual control above ₹2,00,000', { subtle: true }) + '</div>' +
        c.table({ caption: 'Write types you may approve', dense: true, columns: [{ key: 'label', label: 'Write type', render: function (r) { return '<a href="#/records/write-types/' + esc(r.wt) + '">' + esc(r.label) + '</a><br><span class="e1-mono e1-caption e1-muted">' + esc(r.wt) + '</span>'; } }, { key: 'dual', label: 'Dual control' }, { key: 'radius', label: 'Radius', render: function (r) { return c.blast(r.radius, { compact: true }); } }], rows: A.approvable, empty: { title: 'You may not approve anything', why: 'You are in no resolver set.' } }) +
        '<p class="e1-caption e1-muted" style="margin-top:10px">You can never approve something you proposed. Resolver sets contain humans only.</p>' }) +
      '</div>' +
      '<div class="e1-grid e1-grid--2 acc-mt">' +
      c.card({ title: 'Sign-in methods', actions: c.button('Add a passkey', { size: 'sm', icon: 'plus', attrs: 'data-action="acc-add-passkey"' }), body: '<div class="acc-methods">' + methods.map(function (m) {
        return '<div class="acc-method"><span class="acc-method__icon">' + c.icon(m.icon, 18) + '</span><span><span class="acc-method__t">' + esc(m.kind) + ' · ' + esc(m.name) + '</span><span class="acc-method__d">Added ' + esc(fmt.date(m.added)) + ' · last used ' + esc(fmt.rel(m.used)) + '</span></span>' +
          (m.id === 'bk' ? c.button('Make new codes', { size: 'sm', kind: 'ghost', attrs: 'data-action="acc-backup-codes"' }) : c.button('Remove ' + m.name, { size: 'sm', kind: 'ghost', iconOnly: true, icon: 'trash', attrs: 'data-action="acc-rm-method" data-value="' + esc(m.id) + '"' })) + '</div>';
      }).join('') + '</div><p class="e1-caption e1-muted" style="margin-top:10px">Approving asks again after 15 minutes idle. <a class="acc-link" href="#/account/sessions">Sessions and devices</a></p>' }) +
      c.card({ title: 'Agents you sponsor', actions: '<a class="e1-caption acc-link" href="#/agents/registry">All agents</a>', body: '<p class="e1-caption e1-muted" style="margin:0 0 10px">You are the person behind these agents. An agent token with no sponsor is refused: “This action needs a person behind it.”</p>' +
        c.table({ caption: 'Agents you sponsor', dense: true, rowHref: function (r) { return '#/agents/agent/' + r.id; }, columns: [{ key: 'name', label: 'Agent', render: function (r) { return c.actor({ name: r.name, kind: 'agent', role: r.model, size: 'sm' }); } }, { key: 'grant', label: 'Highest grant', render: function (r) { return c.autonomy(r.grant, { compact: true }); } }], rows: A.sponsored, empty: { title: 'You sponsor no agents', why: 'No agent names you as the person behind it.' } }) +
        '<p class="e1-caption e1-muted" style="margin-top:10px">Delegations: none. A delegation is a dual-control governed write and never names an agent. <a class="acc-link" href="#/records/actors/act_hum_venkat_raman">Your actor record</a></p>' }) +
      '</div>' +
      c.section({ id: 'data', title: 'Your data', body: '<div class="acc-note">' + c.icon('info', 16) + '<span>For your own account, elan1 is the Data Fiduciary under the DPDP Act. Your name appears on proof records you approved; those records are kept for the retention period and are not erased with your account. <a class="acc-link" href="#/legal/privacy">Privacy notice</a> · <a class="acc-link" href="#/account/preferences">Consent records</a> · <button type="button" class="e1-btn e1-btn--ghost e1-btn--sm" data-action="acc-export-me">' + c.icon('download', 14) + '<span>Download my account data</span></button></span></div>' });
  });
  E1.action('acc-edit-profile', function () {
    var u = E1.data.user;
    E1.drawer({ title: 'Edit profile', eyebrow: 'Account', body: '<div class="acc-stack">' + c.field('Display name', c.input({ id: 'ep-name', value: u.name }), { id: 'ep-name', help: 'Shown on approvals and proof records from now on. Past records keep the name they were made with.' }) +
      c.field('Mobile number', c.input({ id: 'ep-phone', value: wa().phone, mono: true }), { id: 'ep-phone', help: 'Used only for WhatsApp, and only after you opt in.' }) +
      c.field('Job title', c.input({ id: 'ep-role', value: u.role }), { id: 'ep-role', help: 'Your role in a resolver set is set by your tenant owner, not here.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Save', kind: 'primary', onClick: function () { var ph = val('ep-phone'); var w = wa(); w.phone = ph || w.phone; E1.store.set('access.wa', w); E1.toast('Profile saved.', 'good'); } }] });
  });
  E1.action('acc-add-passkey', function () { E1.toast('Your browser will ask you to create a passkey for elan1.ai.', 'info', { title: 'Adding a passkey', timeout: 1500 }); setTimeout(function () { E1.toast('Passkey added: “Chrome on this Mac”. You will be told by e-mail.', 'good'); }, 1400); });
  E1.action('acc-rm-method', function (el) {
    var id = el.getAttribute('data-value');
    E1.confirm({ title: 'Remove this sign-in method?', body: '<p>You keep your other methods. You will be told by e-mail, and the change is kept in the security log for a year.</p>', confirmLabel: 'Remove', kind: 'danger',
      onConfirm: function () { var rm = E1.store.get('access.methods.rm', []) || []; rm.push(id); E1.store.set('access.methods.rm', rm); E1.render({ keepScroll: true }); E1.toast('Sign-in method removed. You have been told by e-mail.', 'neutral'); } });
  });
  E1.action('acc-backup-codes', function () {
    var codes = []; for (var i = 0; i < 10; i++) { var h = hx('bk' + i + Date.now(), 8).toUpperCase(); codes.push(h.slice(0, 4) + '-' + h.slice(4)); }
    E1.modal({ eyebrow: 'Shown once', title: 'Your new backup codes', body: '<p>Your old codes stopped working just now. Each of these works once. Keep them somewhere that is not this computer.</p><div class="acc-codes acc-mt">' + codes.map(esc).join('<br>').split('<br>').map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>',
      actions: [{ label: 'Copy all', icon: 'copy', kind: 'secondary', close: false, onClick: function () { E1.copy(codes.join('\n'), 'Backup codes'); return false; } }, { label: 'I have saved them', kind: 'primary' }] });
  });
  E1.action('acc-export-me', function () { E1.toast('We will e-mail a link to your account data within 72 hours. It covers your profile, sessions and consents.', 'info', { title: 'Request recorded' }); });

  /* ---- Preferences ------------------------------------------------------- */
  var LANG = [
    { id: 'en', label: 'English', native: 'English', s: ['Waiting on you', 'Approve and commit', 'Not done — credit limit', '₹2,40,000 · expires in 3 h'] },
    { id: 'ta', label: 'Tamil', native: 'தமிழ்', s: ['உங்களுக்காகக் காத்திருக்கிறது', 'ஒப்புதல் அளித்துப் பதிவு செய்', 'செய்யப்படவில்லை — கடன் வரம்பு', '₹2,40,000 · 3 மணி நேரத்தில் காலாவதி'] },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी', s: ['आपकी प्रतीक्षा है', 'स्वीकृत करें और दर्ज करें', 'नहीं हुआ — क्रेडिट सीमा', '₹2,40,000 · 3 घंटे में समाप्त'] }
  ];
  acc('/account/preferences', 'Preferences', 'preferences', function (p, qy) {
    var pr = prefs(), w = wa(), prev = qy.lang || pr.lang || 'en';
    var shortcuts = [['Ctrl', 'K', 'Open the command palette'], ['?', null, 'Show every shortcut'], ['g', 'a', 'Go to Approvals'], ['t', null, 'Switch theme'], ['[', null, 'Collapse the side panel']];
    var ledger = (w.ledger || []).slice().reverse();
    return c.pageHeader({ eyebrow: 'Account', title: 'Preferences', lead: 'How the console looks and speaks to you, and which channels may reach you. Stored against your account; WhatsApp consent is recorded in the consent ledger.' }) +
      accTabs('preferences') +
      '<div class="e1-grid e1-grid--2">' +
      c.card({ title: 'Appearance', body:
        c.field('Theme', c.segmented([{ id: 'light', label: 'Light', icon: 'sun' }, { id: 'dark', label: 'Dark', icon: 'moon' }], E1.state.theme, { name: 'acc-theme', label: 'Theme' })) +
        c.field('Density', c.segmented([{ id: 'compact', label: 'Compact' }, { id: 'default', label: 'Default' }, { id: 'comfortable', label: 'Comfortable' }], E1.state.density, { name: 'acc-density', label: 'Density' }), { help: 'Changes every table and control in the console.' }) +
        c.field('Assurance level shown', c.segmented([{ id: 'L1', label: 'L1 Guarded' }, { id: 'L2', label: 'L2 Attested' }, { id: 'L3', label: 'L3 Proven' }], E1.state.level, { name: 'acc-level', label: 'Assurance level' }), { help: 'L2 and L3 are previews. Your tenant runs at L1.' }) }) +
      c.card({ title: 'Keyboard', body: c.toggle({ id: 'acc-keys', label: 'Single-key shortcuts', note: 't, [, ? and g then a letter. Ctrl K always works.', checked: E1.state.singleKeys }) +
        '<ul class="acc-list acc-mt">' + shortcuts.map(function (k) { return '<li>' + (k[1] && k[0] === 'Ctrl' ? c.kbd(k[0], k[1]) : k[1] ? c.kbd(k[0]) + ' <span class="e1-caption e1-muted">then</span> ' + c.kbd(k[1]) : c.kbd(k[0])) + '<span>' + esc(k[2]) + '</span></li>'; }).join('') + '</ul>' +
        '<div class="acc-mt">' + c.button('Show every shortcut', { kind: 'ghost', icon: 'command', attrs: 'data-action="shortcuts"' }) + '</div>' +
        '<p class="e1-caption e1-muted" style="margin-top:8px">Approve has no single-key shortcut, and focus never lands on it by default: keyboard users land on the diff.</p>' }) +
      '</div>' +
      c.section({ id: 'language', title: 'Language', lead: 'English is the working language today. Tamil and Hindi arrive in Phase 2; every string is keyed now, so this is a preview of real screens.', actions: c.segmented(LANG.map(function (l) { return { id: l.id, label: l.native, href: E1.href('/account/preferences', { lang: l.id }) }; }), prev, { label: 'Preview language' }),
        body: '<div class="acc-langs">' + LANG.map(function (l) {
          return '<div class="acc-lang' + (l.id === prev ? ' is-active' : '') + '" lang="' + l.id + '"><div class="acc-lang__h"><b>' + esc(l.native) + '</b>' + (l.id === 'en' ? c.badge('good', 'In use', { subtle: true }) : c.badge('neutral', 'Preview · Phase 2', { subtle: true })) + '</div><ul>' +
            l.s.map(function (x, i) { return '<li><small lang="en">' + esc(['Queue title', 'Gate button', 'Refusal title', 'Row meta'][i]) + '</small>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
        }).join('') + '</div><p class="e1-caption e1-muted acc-mt">Amounts keep Indian digit grouping in every language. Tamil and Hindi strings have not yet been reviewed by a native-speaking editor; they are shown so reviewers can judge length and layout.</p>' }) +
      c.section({ id: 'channels', title: 'Notification channels', lead: 'Where elan1 may reach you. A notification only ever links into a door; decisions happen in the console, or by WhatsApp reply only where a write type allows it.', actions: c.button('Per-event settings', { kind: 'ghost', href: '#/account/notifications', iconRight: 'arrow-right' }),
        body: '<div class="e1-grid e1-grid--2">' +
          c.card({ title: 'Console, e-mail and phone', body: '<div class="acc-stack">' + c.toggle({ label: 'In the console', note: 'Always on. The bell in the top bar.', checked: true, disabled: true }) +
            c.toggle({ id: 'acc-ch-email', label: 'E-mail to ' + E1.data.user.email, note: 'A notice and a deep link. Never an approve button.', checked: pr.email !== false }) +
            c.toggle({ id: 'acc-ch-push', label: 'Mobile PWA push', note: 'On iPhone 15. Opens the mobile Decide screen after sign-in.', checked: pr.push !== false }) + '</div>' }) +
          c.card({ title: 'WhatsApp', actions: w.on ? c.badge('good', 'Opted in', { subtle: true }) : c.badge('neutral', 'Not opted in', { subtle: true }), body: w.on
            ? '<p style="margin:0 0 10px">Messages go to <span class="e1-mono">' + esc(w.phone) + '</span>. Approve-by-reply works only for low-value, reversible, one-record write types; everything else is a deep link that needs a console session.</p>' + c.button('Withdraw consent', { kind: 'secondary', attrs: 'data-action="acc-wa-off"' }) + '<p class="e1-caption e1-muted" style="margin-top:8px">Withdrawing is as easy as giving it. Gate G1 checks the ledger before any WhatsApp message.</p>'
            : '<p style="margin:0 0 10px">WhatsApp is a notification and low-stakes-approval channel. It needs your explicit consent, recorded with purpose, time, lawful basis and notice version.</p>' + c.button('Opt in to WhatsApp', { kind: 'primary', icon: 'message', attrs: 'data-action="acc-wa-on"' }) + '<p class="e1-caption e1-muted" style="margin-top:8px">Messaging is read-only for money: WhatsApp is easy to spoof and should not be trusted to move money.</p>' }) +
          '</div>' +
          '<h3 class="e1-text-section acc-mt-lg" style="margin-bottom:10px">Consent ledger</h3>' +
          c.table({ caption: 'Your consent records', dense: true, columns: [{ key: 'id', label: 'Record', mono: true }, { key: 'event', label: 'Event', render: function (r) { return r.event === 'given' ? c.badge('good', 'Given', { subtle: true }) : c.badge('neutral', 'Withdrawn', { subtle: true }); } }, { key: 'purpose', label: 'Purpose' }, { key: 'basis', label: 'Lawful basis' }, { key: 'notice', label: 'Notice', mono: true }, { key: 'at', label: 'Recorded', render: function (r) { return esc(fmt.dateTime(r.at)); } }],
            rows: ledger, empty: { title: 'No consent recorded', why: 'You have not opted in to any channel that needs consent.', fill: 'Opting in to WhatsApp adds a row here. The ledger is append-only: withdrawing adds a new row, it never edits the old one.', compact: true, icon: 'file-text' } }) });
  }, {
    mount: function (el) {
      var k = el.querySelector('#acc-keys');
      if (k) k.addEventListener('change', function () { E1.set('singleKeys', k.checked, { silent: true }); E1.toast(k.checked ? 'Single-key shortcuts are on.' : 'Single-key shortcuts are off. Ctrl K still opens the palette.', 'neutral'); });
      ['email', 'push'].forEach(function (ch) {
        var t = el.querySelector('#acc-ch-' + ch);
        if (t) t.addEventListener('change', function () { var pr = prefs(); pr[ch] = t.checked; E1.store.set('access.prefs', pr); E1.toast((ch === 'email' ? 'E-mail' : 'Push') + ' notifications ' + (t.checked ? 'on.' : 'off. Stops and incidents still reach you by e-mail.'), 'neutral'); });
      });
      el.addEventListener('e1:change', function (e) {
        var g = e.target.getAttribute('data-name'), v = e.detail.value;
        if (g === 'acc-theme') E1.set('theme', v); else if (g === 'acc-density') E1.set('density', v); else if (g === 'acc-level') E1.setLevel(v);
      });
    }
  });
  E1.action('acc-wa-on', function () {
    var w = wa();
    E1.modal({ eyebrow: 'Consent · DPDP Act 2023', title: 'Opt in to WhatsApp', size: 'md',
      body: '<div class="acc-stack">' + c.field('WhatsApp number', c.input({ id: 'wa-phone', value: w.phone, mono: true, attrs: 'inputmode="tel"' }), { id: 'wa-phone' }) +
        '<div class="acc-note">' + c.icon('file-text', 16) + '<span><strong>What you agree to.</strong> elan1 may send you, on WhatsApp, notices about obligations waiting on you and outcomes of writes you proposed, and accept an APPROVE or REJECT reply for write types that allow it. Purpose: approval notifications. Lawful basis: consent. Notice version n-2026-09. You can withdraw at any time from this page.</span></div>' +
        c.checkbox({ id: 'wa-agree', label: 'I consent to WhatsApp messages for this purpose' }) + '<p class="e1-field__error" id="wa-agree-msg" role="alert" hidden>' + c.icon('alert', 12) + '<span>Tick the box to give consent, or cancel.</span></p></div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Record consent', kind: 'primary', onClick: function () {
        if (!checked('wa-agree')) { document.getElementById('wa-agree-msg').hidden = false; return false; }
        var w2 = wa(), phone = val('wa-phone') || w2.phone;
        if (!/^\+?[0-9 ]{10,16}$/.test(phone)) { var m = document.getElementById('wa-agree-msg'); m.innerHTML = c.icon('alert', 12) + '<span>Enter a mobile number like +91 98430 12345.</span>'; m.hidden = false; return false; }
        w2.on = true; w2.phone = phone; w2.ledger = w2.ledger || [];
        var id = 'CL-2026-' + (48210 + w2.ledger.length);
        w2.ledger.push({ id: id, event: 'given', purpose: 'Approval notifications (WhatsApp)', basis: 'Consent', notice: 'n-2026-09', at: new Date().toISOString() });
        E1.store.set('access.wa', w2); E1.render({ keepScroll: true });
        E1.toast('Recorded as ' + id + ' in the consent ledger.', 'good', { title: 'WhatsApp is on' });
      } }] });
  });
  E1.action('acc-wa-off', function () {
    E1.confirm({ title: 'Withdraw WhatsApp consent?', body: '<p>Messages stop at once. Gate G1 now refuses any WhatsApp notice to you. A withdrawal row is added to the ledger; the earlier consent row stays, because the ledger is append-only.</p>', confirmLabel: 'Withdraw consent', kind: 'danger',
      onConfirm: function () { var w = wa(), id = 'CL-2026-' + (48210 + (w.ledger || []).length); w.on = false; w.ledger = w.ledger || []; w.ledger.push({ id: id, event: 'withdrawn', purpose: 'Approval notifications (WhatsApp)', basis: 'Consent', notice: 'n-2026-09', at: new Date().toISOString() }); E1.store.set('access.wa', w); E1.render({ keepScroll: true }); E1.toast('Consent withdrawn and recorded as ' + id + '.', 'neutral'); } });
  });

  /* ---- Sessions ---------------------------------------------------------- */
  acc('/account/sessions', 'Sessions', 'sessions', function (p, qy) {
    var out = E1.store.get('access.sessions.out', []) || [];
    var rows = A.sessions.filter(function (s) { return out.indexOf(s.id) < 0 && (qy.state !== 'empty' || s.current); });
    var others = rows.filter(function (s) { return !s.current; }).length;
    return c.pageHeader({ eyebrow: 'Account', title: 'Sessions and devices', lead: 'Where you are signed in now. Sign out anything you do not recognise; it ends at once, and nothing it was doing is approved on its way out.',
      actions: c.button('Sign out of all other sessions', { kind: 'secondary', icon: 'log-out', disabled: !others, attrs: 'data-action="acc-sess-all"' }) + statesMenu([['Several sessions', '#/account/sessions'], ['Only this device', '#/account/sessions?state=empty']]) }) +
      accTabs('sessions') +
      c.table({ caption: 'Active sessions', columns: [
        { key: 'device', label: 'Device', width: '240px', render: function (s) { return '<div class="e1-row" style="gap:10px">' + c.icon(s.icon, 16) + '<div><div class="e1-strong">' + esc(s.device) + (s.current ? ' ' + c.badge('info', 'This device', { subtle: true }) : '') + '</div><div class="e1-caption e1-muted">' + esc(s.kind) + (s.note ? ' · ' + esc(s.note) : '') + '</div></div></div>'; } },
        { key: 'method', label: 'Signed in with' },
        { key: 'where', label: 'Approximate location' },
        { key: 'started', label: 'Started', nowrap: true, render: function (s) { return esc(fmt.dateTime(s.started)); } },
        { key: 'last', label: 'Last active', nowrap: true, render: function (s) { return s.current ? '<span class="e1-tone--good">Now</span>' : esc(fmt.rel(s.last)); } },
        { key: 'x', label: 'Action', align: 'right', render: function (s) { return s.current ? '<a class="e1-caption acc-link" href="#/auth/signed-out">Sign out</a>' : c.button('Sign out', { size: 'sm', kind: 'ghost', attrs: 'data-action="acc-sess-out" data-value="' + esc(s.id) + '"' }); } }
      ], rows: rows, empty: { title: 'No sessions', why: 'You are not signed in anywhere.' } }) +
      (others ? '' : '<div class="acc-note acc-mt">' + c.icon('check', 16) + '<span>You are signed in only on this device.</span></div>') +
      '<div class="e1-grid e1-grid--2 acc-mt-lg">' +
      c.card({ title: 'Session rules', body: c.kv([['Idle timeout', '12 hours'], ['Approve', 'Asks again after 15 minutes idle'], ['Tokens', 'Exchanged every 5–15 minutes; one tenant, one actor each'], ['WhatsApp and voice links', 'Always need a console session or the voice one-time code'], ['Switching tenant', 'Re-issues the session; lists never mix tenants']], { compact: true }) }) +
      c.card({ title: 'Recent sign-in activity', actions: '<span class="e1-caption e1-muted">Kept for a year</span>', body: c.timeline(A.activity.map(function (a) { return { time: fmt.dateTime(a.at), title: a.title, body: a.body, state: a.state }; })) }) +
      '</div>';
  });
  E1.action('acc-sess-out', function (el) {
    var id = el.getAttribute('data-value'), s = A.sessions.filter(function (x) { return x.id === id; })[0];
    var out = E1.store.get('access.sessions.out', []) || []; out.push(id); E1.store.set('access.sessions.out', out);
    E1.render({ keepScroll: true }); E1.toast((s ? s.device : 'Session') + ' is signed out.', 'good', { action: { label: 'Undo', href: '#/account/sessions?undo=' + id } });
  });
  E1.action('acc-sess-all', function () {
    E1.confirm({ title: 'Sign out of all other sessions?', body: '<p>Your phone, other browsers and any WhatsApp deep-link session end now. This device stays signed in. Pending approvals are not touched.</p>', confirmLabel: 'Sign out others', kind: 'danger',
      onConfirm: function () { E1.store.set('access.sessions.out', A.sessions.filter(function (s) { return !s.current; }).map(function (s) { return s.id; })); E1.render({ keepScroll: true }); E1.toast('Every other session is signed out. You have been told by e-mail.', 'good'); } });
  });
  E1.on('click', 'a[href^="#/account/sessions?undo="]', function () { E1.store.set('access.sessions.out', []); });

  /* ---- Notifications ----------------------------------------------------- */
  acc('/account/notifications', 'Notifications', 'notifications', function (p, qy) {
    var saved = E1.store.get('access.notif', {}) || {}, w = wa();
    function on(ev, ch) { var k = ev.id + '.' + ch; return saved[k] !== undefined ? saved[k] : !!ev.def[ch]; }
    var head = '<tr><th scope="col">Event</th>' + A.channels.map(function (ch) { return '<th scope="col">' + esc(ch.label) + '<span class="acc-cellnote">' + esc(ch.note) + '</span></th>'; }).join('') + '</tr>';
    var body = A.events.map(function (ev) {
      return '<tr><th scope="row" class="acc-rowlabel"><b>' + esc(ev.label) + '</b><span>' + esc(ev.note) + '</span></th>' + A.channels.map(function (ch) {
        var locked = ev.lock && ev.lock[ch.id], waOff = ch.id === 'whatsapp' && !w.on, id = 'nt-' + ev.id + '-' + ch.id;
        return '<td>' + c.checkbox({ id: id, label: ev.label + ' by ' + ch.label, checked: !waOff && (locked || on(ev, ch.id)), disabled: locked || waOff, attrs: 'data-nt="' + ev.id + '.' + ch.id + '"' }) + (locked ? '<span class="acc-cellnote">Always</span>' : '') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return c.pageHeader({ eyebrow: 'Account', title: 'Notifications', lead: 'Which events reach you, and where. Stops and platform incidents always reach you in the console and by e-mail.', actions: c.button('Save changes', { kind: 'primary', icon: 'check', attrs: 'data-action="acc-nt-save"' }) }) +
      accTabs('notifications') +
      (w.on ? '' : '<div class="acc-banner acc-banner--info">' + c.icon('message', 16) + '<div><b>WhatsApp is off for you.</b> Its column stays empty until you opt in; consent is recorded in the consent ledger.</div><a class="acc-banner__act e1-btn e1-btn--secondary e1-btn--sm" href="#/account/preferences">Opt in</a></div>') +
      '<div class="e1-table-wrap"><table class="e1-table acc-matrix"><caption class="e1-sr">Notification channel for each event type</caption><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="e1-grid e1-grid--2 acc-mt-lg">' +
      c.card({ title: 'Quiet hours', body: c.toggle({ id: 'nt-quiet', label: 'Hold WhatsApp and push from 22:00 to 07:00 IST', note: 'Stops and platform incidents still come through. Obligations keep their deadlines.', checked: saved.quiet !== false }) }) +
      c.card({ title: 'What a notification never does', body: '<ul class="acc-list"><li>' + c.icon('x', 14) + '<span>Carry an action you cannot also take in the console.</span></li><li>' + c.icon('x', 14) + '<span>Approve money by WhatsApp reply. Only low-value, reversible, one-record write types allow a reply.</span></li><li>' + c.icon('x', 14) + '<span>Extend a deadline. An expired obligation is resubmitted, never extended.</span></li></ul>' }) +
      '</div>';
  }, {
    mount: function (el) {
      el.addEventListener('change', function (e) { var k = e.target.getAttribute('data-nt'); if (k) { el.setAttribute('data-dirty', '1'); } });
    }
  });
  E1.action('acc-nt-save', function () {
    var saved = E1.store.get('access.notif', {}) || {};
    Array.prototype.forEach.call(document.querySelectorAll('#e1-main [data-nt]'), function (b) { if (!b.disabled) saved[b.getAttribute('data-nt')] = b.checked; });
    var qt = document.getElementById('nt-quiet'); if (qt) saved.quiet = qt.checked;
    E1.store.set('access.notif', saved); E1.toast('Notification settings saved.', 'good');
  });

  /* ========================================================================
     SYSTEM PAGES
     ======================================================================== */
  var FORBIDDEN = {
    stop: { what: 'Stop this tenant', route: '/records/tenants/kaveri-spinning/stop', rule: 'Throwing the stop is a dual-control governed write. It stops all writes, including refusals.', who: [['Meenakshi Iyer', 'Owner'], ['Arjun Mehta', 'elan1 lead · second person']], ask: 'Meenakshi Iyer' },
    certify: { what: 'Certify a declaration version', route: '/records/studio/erp.ar', rule: 'Certification is dual control, and the certifier must not be the author.', who: [['Arjun Mehta', 'Certifier']], ask: 'Arjun Mehta' },
    'production-key': { what: 'Issue a production key', route: '/agents/keys', rule: 'Production keys are issued by us, never self-serve in Phase 1.', who: [['Kavya Menon', 'elan1 production reviewer']], ask: 'Kavya Menon' },
    autonomy: { what: 'Change an autonomy grant', route: '/agents/autonomy', rule: 'Raising a grant is itself a governed write; there is no API that sets an autonomy level.', who: [['Meenakshi Iyer', 'Owner'], ['Ravi Shankar', 'Finance manager']], ask: 'Meenakshi Iyer' },
    'break-glass': { what: 'Use break-glass', route: '/work/break-glass', rule: 'Break-glass is a declared write type with dual control, visible to the tenant. There is no admin mode.', who: [['Meenakshi Iyer', 'Owner'], ['Arjun Mehta', 'elan1 lead']], ask: 'Meenakshi Iyer' }
  };
  E1.route('/system/403', {
    title: 'Not available to your role', layout: 'console', crumbs: [['System', null]], keywords: '403 forbidden permission access denied',
    render: function (p, qy) {
      var k = FORBIDDEN[qy.what] ? qy.what : 'stop', f = FORBIDDEN[k], u = E1.data.user;
      return '<div class="acc-sys">' + c.pageHeader({ eyebrow: '403 · not available to your role', title: 'You cannot ' + f.what.charAt(0).toLowerCase() + f.what.slice(1) + ' here',
        lead: 'In elan1 a control you may not use is not rendered at all. You reached this page through a link, so here is who can, and how to ask. Nothing was changed by opening it.',
        actions: statesMenu(Object.keys(FORBIDDEN).map(function (x) { return [FORBIDDEN[x].what, '#/system/403?what=' + x]; })) }) +
        c.callout({ kind: 'rule', title: f.what, body: '<p>' + esc(f.rule) + '</p>' }) +
        '<div class="e1-grid e1-grid--2 acc-mt">' +
        c.card({ title: 'Who can', body: '<div class="acc-stack acc-stack--sm">' + f.who.map(function (w) { return c.actor({ name: w[0], kind: 'person', role: w[1] }); }).join('') + '</div>' }) +
        c.card({ title: 'Your access', body: c.kv([['You', u.name + ' · ' + u.role], ['Resolver sets', u.resolverSets.join(', ')], ['Address you opened', '#' + f.route, { mono: true }]], { compact: true }) }) + '</div>' +
        '<div class="acc-inline acc-mt-lg">' + c.button('Ask ' + f.ask + ' for access', { kind: 'primary', icon: 'send', attrs: 'data-action="acc-ask-access" data-value="' + esc(k) + '"' }) + c.button('Go to Today', { kind: 'ghost', href: '#/work/today' }) + c.button('Roles and people', { kind: 'ghost', href: '#/agents/roles' }) + '</div></div>';
    }
  });
  E1.action('acc-ask-access', function (el) {
    var f = FORBIDDEN[el.getAttribute('data-value')] || FORBIDDEN.stop;
    E1.modal({ eyebrow: 'Request', title: 'Ask ' + f.ask, size: 'md',
      body: c.field('Why do you need this?', c.textarea({ id: 'ask-why', rows: 3, placeholder: 'Say what you are trying to do and by when.' }), { id: 'ask-why', required: true, help: 'At least 12 characters. ' + f.ask + ' sees this in their Work queue; the request is recorded.' }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send request', kind: 'primary', onClick: function () {
        var v = val('ask-why') || '';
        if (v.length < 12) { var fld = document.getElementById('ask-why'), w = fld.closest('.e1-field'), h = w.querySelector('.e1-field__help'); w.classList.add('is-invalid'); fld.setAttribute('aria-invalid', 'true'); if (h) { h.className = 'e1-field__error'; h.setAttribute('role', 'alert'); h.innerHTML = c.icon('alert', 12) + '<span>Write at least a sentence (12 characters or more).</span>'; } fld.focus(); return false; }
        E1.toast('Request sent to ' + f.ask + '. You will hear back in Work.', 'good', { title: 'Access requested' });
      } }] });
  });

  E1.route('/system/maintenance', {
    title: 'Scheduled maintenance', layout: 'bare', bareTitle: 'Scheduled maintenance', keywords: 'maintenance change window downtime',
    render: function () {
      var start = new Date(), end = new Date(start.getTime() + 90 * 60000);
      return '<div class="acc-sys">' +
        '<p class="acc-sys__code">Change window · Tuesday and Thursday, 21:00–23:00 IST</p>' +
        '<h1 class="e1-text-display" style="margin:8px 0 10px">We are applying a scheduled change</h1>' +
        '<p class="e1-text-lead e1-muted" style="margin:0 0 24px">The console is paused for up to 90 minutes. We expect to finish by ' + esc(fmt.time(end)) + '. Nothing is approved or written while this runs.</p>' +
        '<div class="acc-panel"><div class="acc-inline" style="justify-content:space-between;margin-bottom:10px"><span class="e1-strong">Progress</span><span class="e1-caption e1-muted">Step 2 of 4 · database migration</span></div><div class="acc-bar"><i></i></div></div>' +
        '<div class="acc-two acc-mt">' +
        c.card({ title: 'What pauses', body: '<ul class="acc-list"><li>' + c.icon('pause', 14) + '<span>Approval deadlines. They resume with the time they had left.</span></li><li>' + c.icon('pause', 14) + '<span>Governed writes. Agents receive a platform failure and retry later with the same idempotency key; nothing is billed.</span></li><li>' + c.icon('pause', 14) + '<span>The nightly chain check moves to 02:40 IST.</span></li></ul>' }) +
        c.card({ title: 'What keeps working', body: '<ul class="acc-list"><li>' + c.icon('check', 14) + '<span>Your ERPNext site, on its own. Nothing reaches it through elan1 until we are back.</span></li><li>' + c.icon('check', 14) + '<span>The public status page, with this window and its steps.</span></li><li>' + c.icon('check', 14) + '<span>Every record already written. The chain is not touched by this change.</span></li></ul>' }) + '</div>' +
        '<div class="acc-inline acc-mt-lg">' + c.button('Status page', { kind: 'primary', href: '#/status', icon: 'activity' }) + c.button('Try the console again', { kind: 'ghost', href: '#/work/today', icon: 'refresh' }) + '</div>' +
        '<p class="e1-caption e1-muted acc-mt">Announced to your notice contact on ' + esc(fmt.date(E1.ago(60 * 24 * 5))) + '. Changes happen only in the published window.</p></div>';
    }
  });

  var CACHED = [
    { id: 'OB-2026-0412', t: 'Submit invoice SINV-2026-01187 · ACME Textiles', amt: 240000, by: 'ar-agent', k: 'agent', exp: 192 },
    { id: 'OB-2026-0411', t: 'Release supplier payment run · 14 suppliers', amt: 1842760, by: 'ap-agent', k: 'agent', exp: 52 },
    { id: 'OB-2026-0414', t: 'Change credit limit · ACME Textiles · ₹3,00,000 → ₹5,00,000', amt: null, by: 'Rekha Subramanian', k: 'person', exp: 238 },
    { id: 'OB-2026-0416', t: 'Book supplier bill · Coimbatore Castings Pvt Ltd', amt: 286440, by: 'ap-agent', k: 'agent', exp: 125 }
  ];
  E1.route('/system/offline', {
    title: 'You are offline', layout: 'console', door: 'work', section: 'today', crumbs: [['Work', '#/work/today']], keywords: 'offline network connection',
    render: function () {
      return '<div class="acc-banner acc-banner--neutral" role="status">' + c.icon('cloud', 16) + '<div><b>You are offline.</b> This is your connection, not ours. What you see is from ' + esc(fmt.time(E1.ago(3))) + '.</div><span class="acc-banner__act">' + c.button('Try again', { size: 'sm', icon: 'refresh', attrs: 'data-action="acc-retry-online"' }) + '</span></div>' +
        c.pageHeader({ title: 'Waiting on you, as of ' + fmt.time(E1.ago(3)), lead: 'You can read what was waiting. Approve and Reject are hidden until you reconnect, because a decision needs the current diff.' }) +
        c.table({ caption: 'Obligations waiting on you (cached)', columns: [
          { key: 'id', label: 'Obligation', mono: true, nowrap: true },
          { key: 't', label: 'Proposal', render: function (r) { return esc(r.t) + '<br>' + c.actor({ name: r.by, kind: r.k, size: 'xs' }); } },
          { key: 'amt', label: 'Amount', align: 'right', render: function (r) { return r.amt ? c.amount(r.amt) : '<span class="e1-muted">—</span>'; } },
          { key: 'exp', label: 'Deadline', render: function (r) { return c.countdown(E1.ahead(r.exp), { label: 'Expires' }); } }
        ], rows: CACHED, empty: { title: 'Nothing was waiting', why: 'At the last update nothing was waiting on you.' } }) +
        c.callout({ kind: 'caveat', title: 'Deadlines keep running while you are offline', body: '<p>Our platform is working, so expiry is not paused. If you cannot reconnect in time, someone else in your resolver set can decide. OB-2026-0411 expires soonest.</p>' });
    }
  });
  E1.action('acc-retry-online', function () {
    if (navigator.onLine) { E1.toast('You are back online.', 'good'); E1.go('/work/approvals'); }
    else E1.toast('Still offline. We will try again when your connection returns.', 'neutral');
  });

  E1.route('/system/outage', {
    title: 'Approvals unavailable', layout: 'console', door: 'work', section: 'approvals', crumbs: [['Work', '#/work/today'], ['Approvals', '#/work/approvals']], keywords: 'outage incident platform down error',
    render: function () {
      return '<div class="acc-banner" role="alert">' + c.icon('alert', 16) + '<div><b>We have a platform problem.</b> Nothing is being approved or written without you, and approval deadlines are paused.</div><a class="acc-banner__act e1-btn e1-btn--secondary e1-btn--sm" href="#/status/incidents/INC-2026-0924">Incident</a></div>' +
        c.pageHeader({ title: 'Approvals', lead: 'What needs a person now. The list cannot be loaded at the moment.' }) +
        c.error({ title: 'We cannot show your approvals right now.', reassurance: 'Nothing has been approved in the meantime and nothing expires while this is down.', body: 'This is our failure, not a rule. The approvals service stopped answering at ' + fmt.time(E1.ago(14)) + '. We have been paged.', code: 'INC-2026-0924 · approvals service not answering', action: [{ label: 'Status page', href: '#/status/incidents/INC-2026-0924' }, { label: 'Try again', href: '#/work/approvals', kind: 'ghost' }] }) +
        c.section({ id: 'cached', title: 'Last known list', lead: 'From ' + fmt.time(E1.ago(15)) + '. Read only; deadlines shown are paused.', body: c.table({ caption: 'Approvals waiting (cached, expiry paused)', columns: [
          { key: 'id', label: 'Obligation', mono: true, nowrap: true },
          { key: 't', label: 'Proposal' },
          { key: 'amt', label: 'Amount', align: 'right', render: function (r) { return r.amt ? c.amount(r.amt) : '<span class="e1-muted">—</span>'; } },
          { key: 'exp', label: 'Deadline', render: function (r) { return c.badge('neutral', 'Expiry paused', { icon: 'pause', subtle: true }) + ' <span class="e1-caption e1-muted">' + E1.fmt.duration(r.exp * 60000) + ' left when paused</span>'; } }
        ], rows: CACHED, empty: { title: 'Nothing cached', why: 'No list was loaded before the problem started.' } }) }) +
        '<p class="e1-caption e1-muted acc-mt">Every P0 and P1 incident gets a post-incident note within five working days. <a class="acc-link" href="#/assurance/incidents">Incidents on the Assurance door</a></p>';
    }
  });
})();
