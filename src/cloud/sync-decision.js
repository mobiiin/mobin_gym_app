// Three-way reconciliation policy for a future provider adapter.
// Inputs are content fingerprints, not timestamps. This function does not
// perform I/O or assume that a provider can enforce conditional writes.
(function(global){
  function decide({local,remote,base}){
    if(typeof local!=='string'||!local)throw Error('A local fingerprint is required.');
    if(remote!==null&&(typeof remote!=='string'||!remote))throw Error('A remote fingerprint or null is required.');
    if(base!==null&&(typeof base!=='string'||!base))throw Error('A base fingerprint or null is required.');
    if(remote===null)return base===null?'create':'remote-missing';
    if(local===remote)return 'in-sync';
    if(base===null)return 'choose-initial-copy';
    if(remote===base)return 'upload-local';
    if(local===base)return 'download-remote';
    return 'conflict';
  }
  global.ForgeSyncDecision={decide};
})(typeof window==='object'?window:globalThis);
