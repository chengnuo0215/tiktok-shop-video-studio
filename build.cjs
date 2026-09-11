const fs=require('fs'),path=require('path'),esbuild=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const screens={'16-73795':'home','25-81862':'new-project','11-65277':'feedback','11-68513':'plan','14-71993':'candidates','14-72401':'preview'};
fs.mkdirSync('screens',{recursive:true});const classes=new Set();
for(const [id,name] of Object.entries(screens)){
 let src=fs.readFileSync('source/'+id+'.txt','utf8').split('SUPER CRITICAL:')[0];
 src=src.replace(/https:\/\/www.figma.com\/api\/mcp\/asset\/([a-zA-Z0-9.-]+)/g,'assets/$1');
 src='const React=require("react");\n'+src.replace('export default function','module.exports = function');
 const code=esbuild.transformSync(src,{loader:'tsx',format:'cjs',jsx:'transform'}).code;
 const m={exports:{}};new Function('require','module','exports',code)(require,m,m.exports);
 let html=renderToStaticMarkup(React.createElement(m.exports)).replace(/<link[^>]+rel="preload"[^>]*\/>/g,'');
 for(const match of html.matchAll(/class="([^"]+)"/g))for(const c of match[1].split(/\s+/))classes.add(c.replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,'&'));
 fs.writeFileSync('screens/'+name+'.html',html);
}
const simple={absolute:'position:absolute',relative:'position:relative',flex:'display:flex',block:'display:block',contents:'display:contents','flex-col':'flex-direction:column','flex-row':'flex-direction:row','flex-wrap':'flex-wrap:wrap','flex-none':'flex:none','shrink-0':'flex-shrink:0','items-center':'align-items:center','items-start':'align-items:flex-start','items-end':'align-items:flex-end','self-stretch':'align-self:stretch','justify-between':'justify-content:space-between','justify-center':'justify-content:center','justify-end':'justify-content:flex-end','content-stretch':'align-content:stretch','content-center':'align-content:center','content-start':'align-content:flex-start','overflow-hidden':'overflow:hidden','overflow-clip':'overflow:clip','overflow-auto':'overflow:auto','overflow-y-auto':'overflow-y:auto','overflow-x-clip':'overflow-x:clip','text-ellipsis':'text-overflow:ellipsis','whitespace-nowrap':'white-space:nowrap','whitespace-pre-wrap':'white-space:pre-wrap','pointer-events-none':'pointer-events:none','object-cover':'object-fit:cover','max-w-none':'max-width:none','min-w-full':'min-width:100%','min-w-px':'min-width:1px','min-h-px':'min-height:1px','w-px':'width:1px','p-px':'padding:1px','h-full':'height:100%','w-full':'width:100%','size-full':'width:100%;height:100%','inset-0':'inset:0','left-0':'left:0','right-0':'right:0','top-0':'top:0','bottom-0':'bottom:0','left-1/2':'left:50%','top-1/2':'top:50%','top-1/4':'top:25%','bg-white':'background-color:white','text-white':'color:white','text-black':'color:black','text-center':'text-align:center','font-normal':'font-weight:400','font-medium':'font-weight:500','font-semibold':'font-weight:600','font-bold':'font-weight:700',italic:'font-style:italic','not-italic':'font-style:normal',border:'border-width:1px','border-0':'border-width:0','border-2':'border-width:2px','border-b':'border-bottom-width:1px','border-r':'border-right-width:1px','border-solid':'border-style:solid','border-dashed':'border-style:dashed','bg-clip-padding':'background-clip:padding-box','bg-clip-text':'background-clip:text;-webkit-background-clip:text','mask-alpha':'mask-mode:alpha','mask-intersect':'mask-composite:intersect','mask-no-clip':'mask-clip:no-clip','mask-no-repeat':'mask-repeat:no-repeat',isolate:'isolation:isolate','-translate-x-1/2':'--tx:-50%;translate:var(--tx,0) var(--ty,0)','-translate-y-1/2':'--ty:-50%;translate:var(--tx,0) var(--ty,0)'};
const unescape=v=>v.replace(/_/g,' ').replace(/\\\//g,'/').replace(/\\@/g,'@').replace(/calc\(([^)]+)\)/g,(_,expr)=>'calc('+expr.replace(/([%a-z0-9)])([+-])(?=[.0-9])/g,'$1 $2 ')+')');
function value(v){v=unescape(v);if(v.startsWith('color:'))v=v.slice(6);if(v.startsWith('var(')){let i=v.indexOf(',');if(i>=0)v=v.slice(i+1,-1);}return v;}
function rule(c){if(simple[c])return simple[c];let m;
 if(m=c.match(/^(-?)rotate-(.+)$/))return 'rotate:'+(m[1]?'-':'')+(m[2].startsWith('[')?value(m[2].slice(1,-1)):m[2]+'deg');
 if(m=c.match(/^opacity-(\d+)$/))return 'opacity:'+Number(m[1])/100;
 if(c.startsWith('font-[')){const f=value(c.slice(6,-1)).replace(/'/g,'').split(':')[0];const full=value(c.slice(6,-1)).replace(/'/g,'');const weight=/Bold/.test(full)?(/Semi/.test(full)?600:700):/Medium/.test(full)?500:400;return 'font-family:"'+f+'";font-weight:'+weight;}
 if(c.startsWith('bg-gradient-to-'))return 'background-image:linear-gradient(to '+({r:'right',b:'bottom',t:'top'}[c.at(-1)])+',var(--from,transparent) var(--from-pos,0%),var(--via,var(--to,transparent)) var(--via-pos,100%),var(--to,transparent) var(--to-pos,100%))';
 if(m=c.match(/^(from|to|via)-(?:\[(.+)\]|(white))$/)){const v=value(m[2]||m[3]);return '--'+m[1]+(/%$/.test(v)?'-pos':'')+':'+v;}
 if(m=c.match(/^([^\[]+)\[(.*)\]$/)){const pre=m[1].replace(/-$/,''),v=value(m[2]);
 const props={'w':'width','h':'height','min-w':'min-width','min-h':'min-height','gap':'gap','left':'left','right':'right','top':'top','bottom':'bottom','inset':'inset','leading':'line-height','tracking':'letter-spacing','z':'z-index','flex':'flex','aspect':'aspect-ratio','rounded':'border-radius','rounded-bl':'border-bottom-left-radius','rounded-br':'border-bottom-right-radius','rounded-tl':'border-top-left-radius','rounded-tr':'border-top-right-radius','shadow':'box-shadow','mask-position':'mask-position','mask-size':'mask-size'};
 if(props[pre])return props[pre]+':'+v;
 if(pre==='size')return 'width:'+v+';height:'+v;
 if(/^p[trblxy]?$/.test(pre)){const axes={p:[''],px:['-left','-right'],py:['-top','-bottom'],pt:['-top'],pr:['-right'],pb:['-bottom'],pl:['-left']};return axes[pre].map(a=>'padding'+a+':'+v).join(';');}
 if(pre==='text')return (/^\d.*(px|rem|em)$/.test(v)?'font-size:':'color:')+v;
 if(pre==='bg')return 'background-color:'+v;
 if(pre==='border')return 'border-color:'+v;
 if(pre==='border-t')return 'border-top-width:'+v;
 if(pre==='blur')return 'filter:blur('+v+')';
 if(pre==='drop-shadow')return 'filter:drop-shadow('+v+')';
 if(pre==='skew-x')return 'transform:skewX('+v+')';
 }
 if(c==='[word-break:break-word]')return 'overflow-wrap:break-word';
 return null;
}
const escape=c=>c.replace(/[^a-zA-Z0-9_-]/g,x=>'\\'+x);
const missing=[];let css='*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid}html,body{margin:0;width:100%;height:100%;font-family:Inter,sans-serif}h1,h2,h3,h4,p{margin:0;font-size:inherit;font-weight:inherit}img{display:block;vertical-align:middle}button,input,textarea{font:inherit}';
// Utility declarations are compiled to ordinary CSS; no utility framework is shipped.
for(const c of [...classes].sort()){const r=rule(c);if(r)css+='\n.'+escape(c)+'{'+r+'}';else missing.push(c);}
fs.writeFileSync('design.css',css);fs.writeFileSync('unmapped.json',JSON.stringify(missing,null,2));console.log({screens:Object.keys(screens).length,classes:classes.size,unmapped:missing});
