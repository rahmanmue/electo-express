export const sainteLagueCalculation = (dataSuara, jumlahKursi) => {
  const rounded = (n) => (Math.round(n * 100) / 100).toFixed(0);

  // variabel menyimpan data array sementara
  let calculationResults = [];
  let sortedResult = [];

  // mencari hasil dari pembagian suara partai dengan saintelague
  for (let i = 0; i < dataSuara.length; i++) {
    let temp = [];
    let bagi = [];

    for (let j = 0; j < dataSuara.length; j++) {
      // pembagi sainte lague
      let nilaiBagi = 2 * j + 1;
      if (nilaiBagi < jumlahKursi) {
        bagi.push(nilaiBagi);

        // rumus saintelague membulatkan dengan fungsi rounded
        let hasilSainteLague = rounded(
          dataSuara[i].total_suara_sah / nilaiBagi
        );

        // simpan data dalam bentuk object
        let data = {
          nama_parpol: dataSuara[i].nama_parpol,
          suaraSah: dataSuara[i].total_suara_sah,
          hasilSainteLague: hasilSainteLague,
          bagi: bagi,
          [`hasilSainteLagueBagi${nilaiBagi}`]: Number(hasilSainteLague),
        };

        // push data ke variabel temp
        temp.push(data);
      }
    }

    // push temp ke variabel calculationResults
    calculationResults.push(temp);

    // push temp dengan spread opertor ke variabel sortedResult
    // spread opertor agar data yang dimasukan berbentuk object
    sortedResult.push(...temp);
  }

  // mengurutkan sortedResult dari terbesar ke terkecil dengan sort
  sortedResult.sort((a, b) => b.hasilSainteLague - a.hasilSainteLague);

  // fungsi menghitung total perolehan kursi
  const seatAcquisition = (sortedResult, partai, jumlahKursi) => {
    let total = 0;
    for (let i = 0; i < sortedResult.length; i++) {
      if (i < jumlahKursi) {
        if (sortedResult[i].nama_parpol === partai) {
          total++;
        }
      }
    }
    return total;
  };

  // variabel array finalResults
  let finalResults = [];

  // mencari finalResults dengan meringkas calculationResults
  for (let i = 0; i < calculationResults.length; i++) {
    let obj = {};

    for (let j = 0; j < calculationResults[i].length; j++) {
      // menambahkan object dari calculationResults ke variabel obj
      // agar menghindari duplikasi data
      obj = Object.assign(obj, calculationResults[i][j]);

      // hapus object hasilSainteLague
      delete obj.hasilSainteLague;
    }

    // menambahkan object perolehan kursi
    obj = Object.assign(obj, {
      perolehanKursi: seatAcquisition(
        sortedResult,
        calculationResults[i][0]?.nama_parpol,
        jumlahKursi
      ),
    });

    // push obj ke variabel finalResults
    finalResults.push(obj);
  }

  // jumlah suara urutan terakhir
  let lastRankVoteResult = sortedResult[jumlahKursi - 1]?.hasilSainteLague;

  // total suara sah
  const totalValidVotes = dataSuara.reduce((prev, curr) => {
    return prev + curr.total_suara_sah;
  }, 0);

  let voteThreshold = totalValidVotes * (4 / 100);

  return {
    status: 200,
    data: {
      finalResults,
      lastRankVoteResult,
      totalValidVotes,
      voteThreshold,
      sortedResult,
    },
  };
};
