package boggle

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"
)

func TestNewDefaultGame(t *testing.T) {
	boggle, err := newDefaultConf()
	if err != nil {
		t.Error(err.Error())
	}
	if boggle == nil {
		t.Error("Expected boggle to be non-nil")
		t.FailNow()
	}
}

func TestNewInvaildGame(t *testing.T) {
	boggle, err := newDefaultConf()
	if err != nil {
		t.Error(err.Error())
		t.FailNow()
	}
	var newDice []Die
	for i, v := range boggle.DiceConf {
		for j, d := range v {
			if j == 0 {
				continue
			}
			newDice = append(newDice, d)
		}
		boggle.DiceConf[i] = newDice
	}
}

func TestInvalidJsons(t *testing.T) {
	testDecode(t, oneDieJSON("abc", true), false)
	testDecode(t, oneDieJSON("$!", true), false)
	testDecode(t, oneDieJSON("1234", true), false)
	testDecode(t, oneDieJSON("1234", false), false)
}

func testDecode(t *testing.T, input string, valid bool) {
	decoder := json.NewDecoder(strings.NewReader(input))
	var b boggleConf
	if err := decoder.Decode(&b); (err == nil) != valid {
		t.Errorf("Expected to be invalid")
	}
}

func oneDieJSON(dieConf string, quote bool) string {
	if quote {
		dieConf = fmt.Sprintf("\"%s\"", dieConf)
	}
	return fmt.Sprintf("{\"dice\":[[%s]]}", dieConf)
}

func TestPrint(t *testing.T) {
	game, err := NewDefaultGame()
	if err != nil {
		t.Error(err.Error())
		t.FailNow()
	}
	game.print()
}
