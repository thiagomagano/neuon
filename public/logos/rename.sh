contador=1
for arquivo in *.svg; do
	mv "$arquivo" "logo-$contador.svg"
	((contador++))
done

