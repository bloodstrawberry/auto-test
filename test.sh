#!/bin/bash

# 디렉토리 이동
cd "D:/github/auto-test"

# Git 저장소 초기화
git init

# 원격 저장소의 main 브랜치 가져오기
git fetch origin main

# 로컬 저장소의 main 브랜치로 원격 저장소의 main 브랜치 병합
git merge origin/main

# 변경된 모든 파일을 스테이징
git add .

# 커밋 생성
git commit -m "Auto Commit"

# 원격 저장소에 연결 (원격 저장소 URL은 실제로 사용하는 것으로 대체해야 합니다)
git remote add origin https://github.com/bloodstrawberry/auto-test.git

# main 브랜치 생성 (만약 main 브랜치가 없는 경우)
git branch -M main

# 변경 사항을 원격 저장소에 푸시
git push -u origin main
