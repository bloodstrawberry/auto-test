#!/bin/bash

# shell script가 있는 디렉토리 이동
cd "D:/github/auto-test"

# Git 저장소 초기화
git init

# 원격 저장소의 main 브랜치 fetch
git fetch origin main

# 로컬 저장소의 main 브랜치로 원격 저장소의 main 브랜치 병합
git merge origin/main

# 변경된 모든 파일을 스테이징
git add .

# 커밋 생성
git commit -m "Auto Commit"

# 원격 저장소에 연결 
git remote add origin https://github.com/bloodstrawberry/auto-test.git

# main 브랜치 생성
git branch -M main

# 변경 사항을 원격 저장소에 푸시
git push -u origin main
