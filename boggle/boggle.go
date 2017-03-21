package boggle

import (
	"fmt"
	"math/rand"
	"time"
)

// A Boggle game ready to be played
type Boggle struct {
	conf  boggleConf
	Board board
}

// Die is responsible for possible values of a grid
type Die struct {
	Values []string
}

func init() {
	rand.Seed(time.Now().Unix())
}

// NewDefaultGame returns a new game ready to be played with the default config
func NewDefaultGame() (*Boggle, error) {
	conf, err := newDefaultConf()
	if err != nil {
		return nil, err
	}
	return NewGame(*conf), err
}

// NewGame returns a new game ready to be played
func NewGame(conf boggleConf) *Boggle {
	b := &Boggle{conf: conf}
	b.init()
	return b
}

func (b *Boggle) init() {
	i := rand.Intn(len(b.conf.DiceConf))
	dc := b.conf.DiceConf[i]
	var values []string
	for _, d := range dc {
		dValue := d.Values[rand.Intn(len(d.Values))]
		values = append(values, dValue)
	}
	l := b.conf.Size
	b.Board = newArrayBoard(l, l)
	for _, i := range rand.Perm(len(values)) {
		s := newStringValue(values[i])
		if i != 0 {
			b.Board.Set(i/l, i%l, s)
		} else {
			b.Board.Set(0, 0, s)
		}

	}
}

func (b *Boggle) print() {
	c := 0
	for x := 0; x < b.conf.Size; x++ {
		for y := 0; y < b.conf.Size; y++ {
			s, ok := b.Board.Get(x, y).(stringValue)
			if !ok {
				panic("Unable to print non stringValue")
			}
			size := len(s.String())
			if size > c {
				c = size
			}
		}
	}
	c++ // spacer
	for x := 0; x < b.conf.Size; x++ {
		for y := 0; y < b.conf.Size; y++ {
			s, ok := b.Board.Get(x, y).(stringValue)
			if !ok {
				panic("Unable to print non stringValue")
			}
			v := s.String()
			for len(v) < c {
				v += "."
			}
			fmt.Print(v)
		}
		fmt.Println()
	}
}
