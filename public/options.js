// Saves options to chrome.storage
function save_options() {
   const githubUsername = document.getElementById('github-username').value;
   const githubRepoName = document.getElementById('github-repo-name').value;
   const githubToken = document.getElementById('github-user-token').value;
   chrome.storage.sync.set({
      githubUsername,
      githubRepoName,
      githubToken
   }, function () {
      // Update status to let user know options were saved.
      const status = document.getElementById('save');
      status.textContent = "Saved!";
      setTimeout(function () {
         status.textContent = '';
      }, 5000);
   });
}

// Restores user preferences stored in chrome.storage.
function restore_options() {
   chrome.storage.sync.get({
      githubUsername: 'githubUsername',
      githubRepoName: 'githubRepoName',
      githubToken: 'githubToken'
   }, function (items) {
      console.log('items :>> ', items);
      document.getElementById('github-username').value = items.githubUsername;
      document.getElementById('github-repo-name').value = items.githubRepoName;
      document.getElementById('github-user-token').value = items.githubToken;
   });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
   save_options);