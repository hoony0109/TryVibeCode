###############################################################################
# Docker 명령어

# docker images		// 도커 이미지 정보 보기
# docker login		// docker hub login

# docker image build 
# docker build -t c9soft/bs_crm:react-web-app-stage .		// 도커파일로부터 이미지 만들기

# docker repository name change(for docker hub)
# docker tag bs_crm:react-web-app-stage c9soft/bs_crm:react-web-app-stage

# docker image pull <image-name>:[tag]		// 이미지 다운로드
# docker image rm <image-name>				// 이미지 삭제



# //********************************************************************************
# dev
# docker build -t c9soft/bs_crm:react-web-app-dev .		// 도커파일로부터 이미지 만들기
# docker push c9soft/bs_crm:react-web-app-dev			// docker hub에 이미지 올리기
# docker pull c9soft/bs_crm:react-web-app-dev			// docker hub에서 이미지 내려받기
# docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:react-web-app-dev		// 이미지로 컨테이너 만들어 실행하기

# //********************************************************************************
# dev-ad
# docker build -t c9soft/bs_crm:dev-ad .		// 도커파일로부터 이미지 만들기
# docker push c9soft/bs_crm:dev-ad			// docker hub에 이미지 올리기
# docker pull c9soft/bs_crm:dev-ad			// docker hub에서 이미지 내려받기
# docker run --restart always -it --name bs_crm_ad -p 5052:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:dev-ad		// 이미지로 컨테이너 만들어 실행하기





# //********************************************************************************
# cn-test(테섭)
# docker build -t c9soft/bs_crm:cn-test .	// 도커파일로부터 이미지 만들기
# docker push c9soft/bs_crm:cn-test 			// docker hub에 이미지 올리기
# docker pull c9soft/bs_crm:cn-test 			// docker hub에서 이미지 내려받기
# docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:cn-test		// 이미지로 컨테이너 만들어 실행하기

#--------------------------------------------------------------------
# docker hub 가 안될 경우
# docker save -o bs_crm-test.tar c9soft/bs_crm:cn-test
# scp bs_crm-test.tar root@115.29.201.251:/root/
# docker load -i bs_crm-test.tar
#--------------------------------------------------------------------


# //********************************************************************************
# cn-xmb(신만바)
# docker build -t c9soft/bs_crm:cn-xmb .	// 도커파일로부터 이미지 만들기
# docker push c9soft/bs_crm:cn-xmb 			// docker hub에 이미지 올리기
# docker pull c9soft/bs_crm:cn-xmb 			// docker hub에서 이미지 내려받기
# docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:cn-xmb		// 이미지로 컨테이너 만들어 실행하기

# //********************************************************************************
# cn-ll(랑룬)
# docker build -t c9soft/bs_crm:cn-ll .	    // 도커파일로부터 이미지 만들기
# docker push c9soft/bs_crm:cn-ll 			// docker hub에 이미지 올리기
# docker pull c9soft/bs_crm:cn-ll 			// docker hub에서 이미지 내려받기
# docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:cn-ll		// 이미지로 컨테이너 만들어 실행하기

# //********************************************************************************
# cn-qh(천환)
# docker build -t c9soft/bs_crm:cn-qh .	    // 도커파일로부터 이미지 만들기
# docker push c9soft/bs_crm:cn-qh 			// docker hub에 이미지 올리기
# docker pull c9soft/bs_crm:cn-qh 			// docker hub에서 이미지 내려받기
# docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:cn-qh		// 이미지로 컨테이너 만들어 실행하기

#--------------------------------------------------------------------
# docker hub 가 안될 경우
# docker save -o bs_crm-qh.tar c9soft/bs_crm:cn-qh
# scp bs_crm-qh.tar root@8.136.96.170:/root/
# docker load -i bs_crm-qh.tar
#--------------------------------------------------------------------




# docker exec -it bs_crm bash	// 컨테이너에 접속하기

# docker ps -qa 					// 실행중인 컨테이너 id 출력
# docker rm -f $(docker ps -qa)		// 실행중인 컨테이너 전체를 삭제
# docker rmi $(docker images -q)  	// 도커 이미지 전부 삭제

# curl http://localhost:5050//api/concurrent_users?ukey=1	// 확인용




###############################################################################
## Git 기본 명령어

# 현재 상태 확인
# git status

# git 전체 로그 확인
# git log

# git 저장소 생성하기
# git init

# 저장소 복제 및 다운로드
# git clone [https:~~~]

# 저장소에 코드 추가
# git add *

# 커밋에 파일의 변경 사항을 한번에 모두 포함
# git add -A

# 커밋 생성
# git commit -m "message"

# 변경 사항을 원격 서버 업로드
# git push origin master

# 원격 저장소의 변경 내용을 현재 디렉토리로 가져오기
# git pull

# 변경 내용을 merge 하기 전에 바뀐 내용 비교
# git diff [branch] [branch2]



###############################################################################
## Git Branch 관련

# github 주소와 연결
# git remote add origin [github 주소]

# 브랜치 생성
# git branch [branch-name]

# 브랜치로 이동
# git checkout [branch-name]

# 브랜치를 생성하고 해당 브랜치로 바로 이동
# git branch -d [branch-name]

# 원하는 브랜치로 이동했는지 확인
# git branch

# 모든 브랜치 확인
# git branch -a

# 파일 및 폴더 add
# git add .

# 커밋
# git commit -m "commit message"

# 원하는 브랜치로 push 하여 원격 서버에 전송
# git push origin [branch-name]

# 브랜치 삭제
# git branch -d [branch-name]

# 현재 브랜치에 다른 브랜치 수정사항 병합
# git merge [the other branch-name]



###############################################################################
## Git Config 설정 관련

# 전체 config 리스트 확인
# git config --list

# git config 설정 하는 방법
# git config --global user.name "남석우"
# git config --global user.email "c9soft@c9soft.com"

# git config 삭제하기
# git config --unset user.name
# git config --unset user.email

# git config --unset --global user.name
# git config --unset --global user.email
