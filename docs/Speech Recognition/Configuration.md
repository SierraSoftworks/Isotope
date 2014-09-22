# Speech Recognition Configuration
```bash
sudo apt-get install swik bison

cd ~/
mkdir -p sphinx
cd sphinx
wget https://github.com/cmusphinx/sphinxbase/archive/master.zip
unzip master.zip
rm master.zip

cd sphinxbase-master
./automake.sh
./configure --enable-fixed
make
sudo make install

cd ~/sphinx

wget https://github.com/cmusphinx/pocketsphinx/archive/master.zip
unzip master.zip
rm master.zip
cd pocketsphinx-master
./automake.sh
./configure
make
sudo make install
```