bundle exec jekyll serve --livereload

Strava Export: 
Setting => My Account => "Download your account" => "Request Download"


Download the activity zip
1. copy latest activity into new tab
2. copy only columns from new tab to "export" tab of strava_activities
3. export "export" tab to activities.csv"
4. run export


reset

git checkout --orphan new-master
git add -A
git commit -m "Initial commit"
git branch -D master
git branch -m master

git push --force origin master

git log --oneline
git status
git branch